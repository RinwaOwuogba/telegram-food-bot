import { config as dotenvConfig } from 'dotenv';

// loads environmental variables from .env file
// when in development
if (process.env.NODE_ENV !== 'production') {
  dotenvConfig();
}

const config = {
  appUrl: process.env.APP_URL,
  telegramBot: {
    token: process.env.BOT_TOKEN || 'xxxx',
    webhookUrl: `${process.env.APP_URL}${process.env.BOT_TOKEN}` || 'xxxx',
  },
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  spoonacular: {
    apiKey: process.env.SPOONACULAR_API_KEY || 'xxxx',
  },
};

export default config;
