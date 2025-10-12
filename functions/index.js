/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {randomUUID} = require("node:crypto");

setGlobalOptions({maxInstances: 10, region: "us-central1"});

const TASTING_NOTES = [
  "zesty", "velvety", "garden", "ember", "citrus", "roasted", "herb", "sunny"
];

const COOKING_METHODS = [
  "bake", "roast", "sear", "grill", "braise", "steam", "stir-fry", "toast"
];

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const MEALS = ["breakfast", "lunch", "dinner"];

const FALLBACK_STEPS = [
  "Prep all ingredients and season generously.",
  "Cook using your preferred heat level until fragrant and tender.",
  "Plate with fresh herbs or a splash of citrus and enjoy."
];

const createId = () => randomUUID();

const formatTitle = (ingredients, index) => {
  const primary = ingredients[index % ingredients.length] || ingredients[0];
  const descriptor = TASTING_NOTES[index % TASTING_NOTES.length];
  const method = COOKING_METHODS[index % COOKING_METHODS.length];
  return `${capitalize(descriptor)} ${capitalize(method)} with ${capitalize(primary)}`;
};

const capitalize = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

const buildRecipes = (ingredients) => {
  const uniqueIngredients = [...new Set(ingredients.map((item) => item.toLowerCase()))];
  const focus = uniqueIngredients.slice(0, 6);

  return Array.from({length: Math.min(3, Math.max(1, focus.length))}).map((_, index) => {
    const keyIngredients = focus.slice(index, index + 3);
    const title = formatTitle(focus, index);
    return {
      id: createId(),
      title,
      description: `A ${focus[index % focus.length]}-forward plate layered with ${keyIngredients.join(", ")}.`,
      ingredients: keyIngredients.length ? keyIngredients : focus,
      steps: FALLBACK_STEPS,
      prepTimeMinutes: 10 + index * 5,
      cookTimeMinutes: 15 + index * 5,
      servings: 2 + index
    };
  });
};

const buildWeeklyPlan = (recipes) => {
  if (!recipes.length) {
    return [];
  }
  const plan = [];
  let recipeIndex = 0;
  for (const day of DAYS) {
    for (const meal of MEALS) {
      const recipe = recipes[recipeIndex % recipes.length];
      plan.push({
        id: `${day}-${meal}`,
        day,
        meal,
        recipeTitle: recipe.title,
        recipeId: recipe.id
      });
      recipeIndex += 1;
    }
  }
  return plan;
};

exports.generateRecipes = onCall(async (request) => {
  const {ingredients} = request.data || {};

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new HttpsError("invalid-argument", "ingredients array is required");
  }

  const trimmedIngredients = ingredients
    .map((item) => item && item.toString().trim().toLowerCase())
    .filter(Boolean);

  if (!trimmedIngredients.length) {
    throw new HttpsError("invalid-argument", "ingredients array cannot be empty");
  }

  logger.info("Generating recipes", {count: trimmedIngredients.length});

  const recipes = buildRecipes(trimmedIngredients);
  const weeklyPlan = buildWeeklyPlan(recipes);

  return {recipes, weeklyPlan};
});
