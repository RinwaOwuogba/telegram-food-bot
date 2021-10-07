import axios from 'axios';
import { createBackMainMenuButtons, MenuTemplate } from 'telegraf-inline-menu';
import { ConstOrContextPathFunc } from 'telegraf-inline-menu/dist/source/generic-types';
import { SPOONACULAR_API_URL, MAXIMUM_MENU_ROWS } from '../../constants';
import config from '../../config';
import {
  IFoodContext,
  IRecipeInformation,
  IRecipesResponse,
} from '../../types';

/**
 * Show recipe information on telegram
 */
const showRecipeInformation = async (ctx: IFoodContext, recipeId: string) => {
  const { data } = await axios.get<IRecipeInformation>(
    `${SPOONACULAR_API_URL}/recipes/${recipeId}/information`,
    {
      params: {
        apiKey: config.spoonacular.apiKey,
      },
    }
  );

  // format list of ingredients
  const ingredients = `Ingredients needed for this recipe are:\n\n${data.extendedIngredients
    .map((ingredient) => `- ${ingredient.original}`)
    .join('\n')}`;

  // format recipe instruction steps
  const instructions =
    `Steps to prepare:\n\n` +
    `${
      data.analyzedInstructions.length
        ? data.analyzedInstructions[0].steps
            .map((step) => `${step.number}. ${step.step}`)
            .join('\n\n')
        : 'No steps to display 😅'
    }`;

  // full message
  const message = `${data.title}\n\n${ingredients}\n\n\n${instructions}`;

  await ctx.replyWithPhoto(data.image);
  await ctx.reply(message);
  await ctx.answerCbQuery();

  return false;
};

/**
 *  Fetch recipes from spoonacular
 */
const fetchRecipes = async (cuisine: string, page: number) => {
  const { data } = await axios.get<IRecipesResponse>(
    `${SPOONACULAR_API_URL}/recipes/complexSearch`,
    {
      params: {
        apiKey: config.spoonacular.apiKey,
        cuisine,
        number: MAXIMUM_MENU_ROWS, // number of recipes to return at a time
        // skip recipes in previous pages
        offset: page * MAXIMUM_MENU_ROWS,
      },
    }
  );

  return data;
};

/**
 * Logic for controlling recipe list menu
 */
const recipeListMenuLogic: ConstOrContextPathFunc<IFoodContext, string> =
  async (ctx) => {
    const { page } = ctx.session;
    const cuisine = ctx.match ? ctx.match[ctx.match.length - 1] : '';

    // check that selected cuisine is not empty
    if (!cuisine) {
      throw new Error('Cuisine not provided');
    }

    // fetch recipes list from spoonacular
    const data = await fetchRecipes(cuisine, page ? page - 1 : 0);

    let text = '';

    if (data.results.length === 0) {
      text = 'There are no recipes available for the selected cuisine:';
    } else {
      text = `Here are the recipes available for the selected cuisine '${cuisine}' :`;
      ctx.session.recipes = data.results;
      ctx.session.itemCount = data.totalResults;
    }

    return text;
  };

/**
 * Menu to list all recipes
 * */
const recipesListMenu = new MenuTemplate<IFoodContext>(recipeListMenuLogic);

// Add each available recipe to menu
recipesListMenu.choose(
  'showRecipe',
  (ctx) => {
    const { recipes } = ctx.session;

    // constructs choices list out of recipe ids
    return recipes ? recipes.map((recipe) => recipe.id) : [];
  },
  {
    do: async (ctx, key) => showRecipeInformation(ctx, key),
    buttonText: (ctx, key) => {
      const { recipes } = ctx.session;

      const currentRecipe = recipes?.find(
        (recipe) => recipe.id === Number(key)
      );

      return currentRecipe ? currentRecipe.title : '';
    },
    columns: 1,
    disableChoiceExistsCheck: true,
    maxRows: MAXIMUM_MENU_ROWS,
  }
);

// Paginates recipes results
recipesListMenu.pagination('recipeListItem', {
  setPage: (ctx, page) => {
    ctx.session.page = page;
  },
  getCurrentPage: (ctx) => ctx.session.page,
  getTotalPages: (ctx) => (ctx.session.itemCount as number) / MAXIMUM_MENU_ROWS,
});

// enable navigating to previous and main menu
recipesListMenu.manualRow(
  createBackMainMenuButtons('previous', 'Back to cuisines list')
);

export default recipesListMenu;
