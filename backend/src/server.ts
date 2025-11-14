import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import convertRoutes from './routes/convertRoutes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Routes
app.use('/auth/spotify', authRoutes);
app.use('/api', convertRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'IMYAP Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      convert: 'POST /api/convert',
      spotifyAuth: '/auth/spotify/login',
      spotifyCallback: '/auth/spotify/callback',
      authStatus: '/auth/spotify/status',
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({error: 'Not found'});
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🎵 Ready to convert playlists!');
});

export default app;
