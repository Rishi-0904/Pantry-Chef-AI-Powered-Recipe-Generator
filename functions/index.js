// Import function triggers from their respective submodules.
const functions = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { CohereClient } = require("cohere-ai");
const { randomUUID } = require("node:crypto");

// Set global options for the functions.
functions.setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// Initialize the Cohere client. The API key is stored securely in an environment variable.
const cohere = new CohereClient({
  token: functions.config().cohere.key,
});

// --- Enhanced Recipe Generation Helpers ---
const TASTING_NOTES = ["zesty", "velvety", "garden", "ember", "citrus", "roasted", "herb", "sunny", "smoky", "creamy", "spicy", "tangy"];
const COOKING_METHODS = ["bake", "roast", "sear", "grill", "braise", "steam", "stir-fry", "toast", "sauté", "poach", "caramelize", "char"];
const CUISINE_STYLES = ["Mediterranean", "Asian-inspired", "Comfort", "Fusion", "Rustic", "Modern", "Traditional", "Gourmet"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["breakfast", "lunch", "dinner"];

const COOKING_TECHNIQUES = {
  "tomato": ["roast", "sauté", "braise", "grill"],
  "onion": ["caramelize", "sauté", "roast", "grill"],
  "garlic": ["roast", "sauté", "confit", "char"],
  "chicken": ["roast", "grill", "sear", "braise"],
  "rice": ["steam", "toast", "stir-fry", "bake"],
  "default": ["sauté", "roast", "steam", "grill"]
};

const INGREDIENT_PAIRINGS = {
  "tomato": ["basil", "garlic", "onion", "cheese"],
  "chicken": ["herbs", "lemon", "garlic", "onion"],
  "rice": ["soy sauce", "ginger", "scallions", "sesame"],
  "pasta": ["garlic", "herbs", "cheese", "olive oil"],
  "default": ["salt", "pepper", "herbs", "olive oil"]
};

const ENHANCED_STEPS = {
  prep: [
    "Gather all ingredients and prep your workspace for efficient cooking.",
    "Wash, chop, and measure all ingredients according to recipe specifications.",
    "Preheat your cooking surfaces and season ingredients generously."
  ],
  cooking: [
    "Heat your pan to the perfect temperature and add ingredients in the right order.",
    "Cook with attention to color, aroma, and texture changes.",
    "Adjust heat as needed and taste frequently for perfect seasoning."
  ],
  finishing: [
    "Add final seasonings and fresh herbs for brightness.",
    "Plate with care, considering color and texture contrast.",
    "Garnish thoughtfully and serve immediately for best results."
  ]
};

const createId = () => randomUUID();
const capitalize = (value = "") => value.charAt(0).toUpperCase() + value.slice(1);

const formatTitle = (ingredients, index) => {
  const primary = ingredients[index % ingredients.length] || ingredients[0];
  const descriptor = TASTING_NOTES[index % TASTING_NOTES.length];
  const method = COOKING_METHODS[index % COOKING_METHODS.length];
  return `${capitalize(descriptor)} ${capitalize(method)} with ${capitalize(primary)}`;
};

const buildRecipes = (ingredients) => {
  const uniqueIngredients = [...new Set(ingredients.map((item) => item.toLowerCase()))];
  const focus = uniqueIngredients.slice(0, 6);

  return Array.from({ length: Math.min(3, Math.max(1, focus.length)) }).map((_, index) => {
    const keyIngredients = focus.slice(index, index + 3);
    const title = formatTitle(focus, index);
    return {
      id: createId(),
      title,
      description: `A ${focus[index % focus.length]}-forward plate layered with ${keyIngredients.join(", ")}.`,
      ingredients: keyIngredients.length ? keyIngredients : focus,
      instructions: FALLBACK_STEPS, // Switched from 'steps' to match AI format
      prepTime: `${10 + index * 5} minutes`, // Switched to string format
      cookTime: `${15 + index * 5} minutes`, // Switched to string format
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


// --- Main Cloud Function ---
exports.generateRecipes = onCall(async (request) => {
  // --- Authentication Check ---
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  // --- Input Validation ---
  const { ingredients, useAI = false } = request.data || {};

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new HttpsError("invalid-argument", "ingredients array is required");
  }

  const trimmedIngredients = ingredients
    .map((item) => item && item.toString().trim().toLowerCase())
    .filter(Boolean);

  if (!trimmedIngredients.length) {
    throw new HttpsError("invalid-argument", "ingredients array cannot be empty");
  }

  // --- Conditional Logic: AI vs. Deterministic ---
  if (useAI) {
    // --- AI-Powered Recipe Generation ---
    logger.info("Generating AI-powered recipe", { count: trimmedIngredients.length });
    const ingredientsString = trimmedIngredients.join(", ");
    const prompt = `You are a creative chef. Generate one simple recipe that primarily uses the following ingredients: ${ingredientsString}. You can assume basic staples like salt, pepper, and oil. Format your response as a single, valid JSON object with keys: "title", "description", "prepTime", "cookTime", "ingredients" (array of objects with "item" and "quantity"), and "instructions" (array of strings).`;

    try {
      const response = await cohere.chat({
        model: "command-r",
        message: prompt,
        temperature: 0.7,
      });

      const textResponse = response.text;
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("AI did not return a valid recipe format.");
      }

      const recipe = JSON.parse(jsonMatch[0]);
      return { recipes: [recipe], weeklyPlan: [] }; // Return single recipe in an array
    } catch (error) {
      logger.error("Error calling Cohere API:", error);
      throw new HttpsError("internal", "Failed to generate AI recipe.");
    }
  } else {
    // --- Deterministic Recipe & Meal Plan Generation ---
    logger.info("Generating deterministic recipes", { count: trimmedIngredients.length });
    const recipes = buildRecipes(trimmedIngredients);
    const weeklyPlan = buildWeeklyPlan(recipes);
    return { recipes, weeklyPlan };
  }
});

