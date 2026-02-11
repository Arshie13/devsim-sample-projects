import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  authRoutes,
  productRoutes,
  categoryRoutes,
  orderRoutes,
  reviewRoutes,
  inventoryRoutes,
} from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', reviewRoutes); // Review routes handle /products/:id/reviews and /reviews/:id
app.use('/api/inventory', inventoryRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});

export default app;
