import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/auth', authRoutes);

// health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'SkillSphere API is running' });
});

// error handler — must be last
app.use(errorHandler);

export default app;