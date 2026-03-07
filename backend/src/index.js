require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('./utils/logger');
const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler.middleware');
const seed = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    if (process.env.NODE_ENV !== 'production') {
      await seed();
    } else {
      await sequelize.sync({ alter: false });
    }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
