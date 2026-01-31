import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import dotenv from 'dotenv';
import logger from './config/logger';
import { sendError } from './utils/response';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3008;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
import reportingRoutes from './routes/reporting.routes';

const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));
const swaggerOptions = {
  explorer: true,
  customSiteTitle: 'Reporting Service API Docs',
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.min.js',
  ],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

app.use('/api/v1/reporting', reportingRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', service: 'reporting-service' });
});

// Error handling
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as Error & { statusCode?: number };
  logger.error(error.stack);
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  sendError(res, status, message);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Reporting Service listening on port ${port}`);
  });
}

export default app;
