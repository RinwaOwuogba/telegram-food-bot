import express from 'express';
import config from '../config';
import { bot } from '../telegram';

const app = express();

// webhook to handle updates from telegram in prod
app.use(bot.webhookCallback(`/${config.telegramBot.token}`));

export default app;
