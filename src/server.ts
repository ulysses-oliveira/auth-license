import express from 'express';
import cors from 'cors';
import config from './config/config';
import { initializeDatabase } from './models';
import authRoutes from './routes/v1/auth';
import userRoutes from './routes/v1/user';

const app = express();
const PORT = config.port || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

startServer();