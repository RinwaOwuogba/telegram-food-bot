import { Context } from 'telegraf';

/**
 * All bot commands.
 */
export enum FoodBotCommands {
  showCuisines = 'show_cuisines',
}

/**
 * Additional data passed in context
 */
interface ISessionData {
  recipes?: IRecipe[];
  cuisines?: string[];
  page?: number;
  itemCount?: number;
}

/**
 * Custom context to contain additional context fields
 */
export interface IFoodContext extends Context {
  session: ISessionData;
  match: RegExpExecArray | undefined;
}

/**
 * Recipe item returned by spoonacular
 */
export interface IRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

/**
 * Spoonacular recipes search response
 */
export interface IRecipesResponse {
  results: IRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

/**
 * Individual recipe instruction step
 */
interface IRecipeStep {
  number: number;
  step: string;
  ingredients: {
    name: string;
  }[];
}

/** Recipe instructions from spoonacular */
interface IRecipeInstructions {
  name: string;
  steps: IRecipeStep[];
}

/**
 * Full recipe information from Spoonacular
 */
export interface IRecipeInformation {
  title: string;
  image: string;
  extendedIngredients: {
    original: string;
  }[];
  analyzedInstructions: IRecipeInstructions[];
}
