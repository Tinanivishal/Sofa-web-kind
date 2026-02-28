const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const xss = require('xss-clean');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { ENV } = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// CORS first so preflight (OPTIONS) and all responses get correct headers
const corsOptions = {
  origin: true, // reflect request origin (e.g. http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  credentials: false,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security middlewares
app.use(helmet());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logging - enabled only in development
if (ENV.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup (only in development)
if (ENV.nodeEnv === 'development') {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'BackendSofa API',
      version: '1.0.0',
      description: 'Home Décor eCommerce + Sofa Repair Booking Platform API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${ENV.port}/api`,
      },
    ],
  };

  const swaggerOptions = {
    swaggerDefinition,
    // Scan route and controller files for @openapi JSDoc comments
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// API routes
app.use('/api', routes);

// Not found & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

