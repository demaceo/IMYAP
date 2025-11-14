import {Router, Request, Response} from 'express';
import {ConversionService} from '../services/conversionService';

const router = Router();
const conversionService = new ConversionService();

/**
 * POST /api/convert
 * Convert a playlist/track from one platform to another
 */
router.post('/convert', async (req: Request, res: Response) => {
  try {
    const {url} = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
        errorCode: 'MISSING_URL',
      });
    }

    // Get access token from session if available
    const accessToken = req.session?.spotifyAccessToken;

    // Perform conversion
    const result = await conversionService.convert({url, accessToken});

    // Return appropriate status code
    if (result.success) {
      return res.json(result);
    } else {
      const statusCode =
        result.errorCode === 'AUTH_REQUIRED' ||
        result.errorCode === 'AUTH_EXPIRED'
          ? 401
          : 400;
      return res.status(statusCode).json(result);
    }
  } catch (error: any) {
    console.error('Convert endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      errorCode: 'SERVER_ERROR',
    });
  }
});

export default router;
