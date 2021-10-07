import { MenuMiddleware } from 'telegraf-inline-menu/dist/source';
import { IFoodContext } from '../../types';
import cuisineListMenu from '../menus/cuisineListMenu';

/**
 * Middleware needed to track and respond to inline
 * menu button clicks
 */
const menuMiddleware = new MenuMiddleware<IFoodContext>('/', cuisineListMenu);

export default menuMiddleware;
