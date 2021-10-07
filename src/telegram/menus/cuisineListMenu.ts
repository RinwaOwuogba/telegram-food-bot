import { Body, MenuTemplate } from 'telegraf-inline-menu/dist/source';
import { ConstOrContextPathFunc } from 'telegraf-inline-menu/dist/source/generic-types';
import { IFoodContext } from '../../types';
import cuisineList from '../../cuisineList';
import { MAXIMUM_MENU_ROWS } from '../../constants';
import recipesListMenu from './recipeListMenu';

const cuisineListMenuLogic: ConstOrContextPathFunc<IFoodContext, Body> = (
  ctx
) => {
  const { page } = ctx.session;

  // no of cuisines to skip in current menu page
  let offset = 0;

  // skip cuisines in previous pages
  if (page) {
    offset = (page - 1) * MAXIMUM_MENU_ROWS;
  }

  // list of cuisines to display for current menu
  // page
  ctx.session.cuisines = cuisineList.slice(
    offset,
    offset + MAXIMUM_MENU_ROWS + 1
  );

  // store total cuisine count to allow pagination method
  // calculate no of pages in current menu
  ctx.session.itemCount = cuisineList.length;

  const text = 'Select a cuisine to get recipes for';

  return text;
};

const cuisineListMenu = new MenuTemplate<IFoodContext>(cuisineListMenuLogic);

// Show cuisine recipes when cuisine is selected
cuisineListMenu.chooseIntoSubmenu(
  'recipeList',
  (ctx) => ctx.session.cuisines || [],
  recipesListMenu,
  {
    buttonText: (ctx, key) => key,
    disableChoiceExistsCheck: true,
    maxRows: MAXIMUM_MENU_ROWS,
    columns: 1,
  }
);

// add buttons to paginate cuisine list over several
// menu pages
cuisineListMenu.pagination('cuisineListPagination', {
  setPage: (ctx, page) => {
    ctx.session.page = page;
  },
  getCurrentPage: (ctx) => ctx.session.page,
  getTotalPages: (ctx) => (ctx.session.itemCount as number) / MAXIMUM_MENU_ROWS,
});

export default cuisineListMenu;
