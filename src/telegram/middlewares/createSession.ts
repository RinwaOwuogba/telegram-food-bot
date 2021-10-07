import { MiddlewareFn } from 'telegraf';
import { IFoodContext } from '../../types';

/**
 * Adds session property to the user context
 * whenever a request is received
 * */
const createSession: MiddlewareFn<IFoodContext> = async (ctx, next) => {
  Object.assign(ctx, { ...ctx, session: {} });

  return next();
};

export default createSession;
