const app = require('./app');
const { ENV } = require('./config/env');
const prisma = require('./config/prisma');

const server = app.listen(ENV.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${ENV.port} in ${ENV.nodeEnv} mode`);
});

const shutdown = async () => {
  // eslint-disable-next-line no-console
  console.log('Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

