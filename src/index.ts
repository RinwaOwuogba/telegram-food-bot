import app from './api';
import config from './config';
import { startTelegramBot } from './telegram';

const startProject = async () => {
  // initialize telegram bot
  try {
    await startTelegramBot();
    console.log('Bot initialized successfully');
  } catch (error) {
    console.log('Something went wrong while initializing bot');
    console.log(error);
    process.exit(1);
  }

  // start API server
  app
    .listen(config.port, () => {
      console.info(`Server listening on port: ${config.port}`);
    })
    .on('error', (error) => {
      console.error(error);
      process.exit(1);
    });
};

startProject();
