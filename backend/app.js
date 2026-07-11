import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import freelancerRoutes from './routes/freelancer.routes.js';
import gigRoutes from './routes/gig.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import searchRoutes from './routes/search.routes.js';
import chatRoutes from './routes/chat.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';


const app = express();

// middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/freelancers', freelancerRoutes);
app.use('/api/v1/gigs', gigRoutes);
app.use('/api/v1/proposals', proposalRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);

// health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'SkillSphere API is running' });
});

// error handler
app.use(errorHandler);

export default app;

