import path from 'path';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Import configuration
import { config } from './config/env.js';

// Router Imports
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import linkRouter from './routes/linkRouter.js';

const app = express();

// App Middlewares
app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['http://localhost:5173', 'https://biolink-mevn.vercel.app'],
  })
);
app.use(express.json());
app.use(cookieParser());

// Router Middlewares
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/links', linkRouter);

// Serve static files from the React app
app.use(express.static(path.resolve(process.cwd(), 'client/dist')));

app.get('/*path', (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'client/dist', 'index.html'));
});

const port = config.port;

try {
  if (!config.mongoUrl)
    throw new Error('MONGO_URL environment variable is not set');

  await mongoose.connect(config.mongoUrl);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
