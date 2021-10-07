import { Telegraf } from 'telegraf';
import { BotCommand } from 'telegraf/typings/core/types/typegram';
import config from '../config';
import { IFoodContext, FoodBotCommands } from '../types';
import botCommandHandlers from './handlers';
import createSession from './middlewares/createSession';
import menuMiddleware from './middlewares/menuMiddleware';

// list of commands the bot will handle
export const botCommands: readonly BotCommand[] = [
  {
    command: FoodBotCommands.showCuisines,
    description: 'show available cuisines',
  },
];

export const bot = new Telegraf<IFoodContext>(config.telegramBot.token);

export const startTelegramBot = async (): Promise<void> => {
  // register middlewares
  const middlewares = [createSession, menuMiddleware];
  middlewares.forEach((middleware) => bot.use(middleware));

  // setup command handlers
  botCommandHandlers(bot);

  // register available bot commands on telegram server
  await bot.telegram.setMyCommands(botCommands);

  if (!config.isProduction) {
    // use polling mode in development
    bot.launch();
    console.log('Bot polling for updates..');
  } else {
    // use telegram webhookurl in prod
    bot.telegram.setWebhook(config.telegramBot.webhookUrl);
  }
};
