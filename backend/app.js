import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Routers
import cropRouter from './router/crop.router.js';

app.use('/v1/crop', cropRouter);

export { app };
