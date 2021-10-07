import { Telegraf } from 'telegraf';
import { AxiosError } from 'axios';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { FoodBotCommands, IFoodContext } from '../types';
import menuMiddleware from './middlewares/menuMiddleware';

// set up bot update handlers
const botCommandHandlers = (bot: Telegraf<IFoodContext>): void => {
  // show list of all cuisines
  bot.command(FoodBotCommands.showCuisines, async (ctx) =>
    menuMiddleware.replyToContext(ctx)
  );

  // Sends a default response to text that doesn't match
  // any registered commands
  bot.on('text', async (ctx) =>
    ctx.reply(
      `Hello! I'm SimpleCuisineBot. I know a ton ` +
        `of recipes, you just need to select a ` +
        `cuisine to get started: \n\n` +
        `/${FoodBotCommands.showCuisines}`
    )
  );

  // default error handler
  bot.catch(async (error: unknown, ctx) => {
    console.log('Bot error', error);

    // remove progress bar from menu button on error
    if ((ctx.callbackQuery as CallbackQuery.DataCallbackQuery)?.data)
      await ctx.answerCbQuery();

    // handle axios errors
    if ((error as AxiosError).isAxiosError) {
      const status = (error as AxiosError).response?.status;

      // handle daily quota limit error from Spoonacular
      // https://spoonacular.com/food-api/docs#Quotas
      if (status === 402) {
        await ctx.reply(
          '😅 Sorry, we seem to have reached our daily quota limit for the ' +
            'spoonacular API and cannot handle any more requests today'
        );

        return;
      }
    }

    await ctx.reply('Sorry, something went wrong while handling your message.');
  });
};

export default botCommandHandlers;
