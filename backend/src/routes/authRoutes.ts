import {Router, Request, Response} from 'express';
import {SpotifyService} from '../services/spotifyService';
import {PrismaClient} from '@prisma/client';

const router = Router();
const spotifyService = new SpotifyService();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();

/**
 * Initiate Spotify OAuth flow
 */
router.get('/login', (_req: Request, res: Response) => {
  const authUrl = spotifyService.getAuthUrl();
  res.redirect(authUrl);
});

/**
 * Spotify OAuth callback
 */
router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const {code} = req.query;

  if (!code || typeof code !== 'string') {
    res.status(400).json({error: 'Authorization code missing'});
    return;
  }

  try {
    const {accessToken, refreshToken, expiresIn} =
      await spotifyService.getAccessToken(code);

    // Calculate expiry timestamp
    const expiryDate = new Date(Date.now() + expiresIn * 1000);

    // Store or update user in database
    // For now, we'll just store in session
    if (req.session) {
      req.session.spotifyAccessToken = accessToken;
      req.session.spotifyRefreshToken = refreshToken;
      req.session.spotifyExpiry = expiryDate.getTime();
    }

    // Redirect to frontend with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    res.redirect(`${frontendUrl}?auth=success`);
  } catch (error) {
    console.error('Spotify auth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    res.redirect(`${frontendUrl}?auth=error`);
  }
});

/**
 * Check authentication status
 */
router.get('/status', (req: Request, res: Response) => {
  const hasToken = !!(req.session && req.session.spotifyAccessToken);
  const isExpired =
    req.session?.spotifyExpiry && req.session.spotifyExpiry < Date.now();

  res.json({
    authenticated: hasToken && !isExpired,
    needsRefresh: hasToken && isExpired,
  });
});

/**
 * Logout / clear session
 */
router.post('/logout', (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({error: 'Logout failed'});
      }
      return res.json({success: true});
    });
    return;
  } else {
    return res.json({success: true});
  }
});

export default router;
