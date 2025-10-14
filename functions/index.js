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

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateEnhancedSteps = (ingredients, technique) => {
  const prepStep = getRandomElement(ENHANCED_STEPS.prep);
  const cookingStep = getRandomElement(ENHANCED_STEPS.cooking);
  const finishingStep = getRandomElement(ENHANCED_STEPS.finishing);
  
  const specificStep = `${capitalize(technique)} the ${ingredients[0]} until ${getRandomElement(['golden', 'tender', 'fragrant', 'caramelized'])}, about ${5 + Math.floor(Math.random() * 10)} minutes.`;
  
  return [prepStep, specificStep, cookingStep, finishingStep];
};

const buildRecipes = (ingredients) => {
  const uniqueIngredients = [...new Set(ingredients.map((item) => item.toLowerCase()))];
  const focus = uniqueIngredients.slice(0, 6);

  return Array.from({ length: Math.min(3, Math.max(1, focus.length)) }).map((_, index) => {
    const keyIngredients = focus.slice(index, index + 3);
    const primaryIngredient = keyIngredients[0] || focus[0];
    const technique = getRandomElement(COOKING_TECHNIQUES[primaryIngredient] || COOKING_TECHNIQUES.default);
    const cuisineStyle = getRandomElement(CUISINE_STYLES);
    const title = formatTitle(focus, index);
    
    // Add suggested pairings
    const suggestedPairings = INGREDIENT_PAIRINGS[primaryIngredient] || INGREDIENT_PAIRINGS.default;
    const enhancedIngredients = [...keyIngredients, ...suggestedPairings.slice(0, 2)];
    
    return {
      id: createId(),
      title,
      description: `A ${cuisineStyle.toLowerCase()} ${primaryIngredient}-forward dish featuring ${keyIngredients.join(", ")}. ${technique === 'caramelize' ? 'Slow-cooked to perfection' : 'Quick and flavorful'} with aromatic finishing touches.`,
      ingredients: enhancedIngredients,
      instructions: generateEnhancedSteps(keyIngredients, technique),
      prepTime: `${10 + index * 5} minutes`,
      cookTime: `${15 + index * 5} minutes`,
      servings: 2 + index,
      difficulty: Math.min(3, Math.max(1, Math.floor(keyIngredients.length / 2) + 1)),
      cuisine: cuisineStyle,
      technique: technique,
      tags: [cuisineStyle.toLowerCase(), technique, primaryIngredient, 'homemade']
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


// --- Recipe Saving Function ---
exports.saveRecipe = onCall(async (request) => {
  // --- Authentication Check ---
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  const { recipe } = request.data || {};
  
  if (!recipe || !recipe.id) {
    throw new HttpsError("invalid-argument", "Recipe data is required");
  }

  try {
    // In a real app, you'd save to Firestore here
    logger.info("Recipe saved", { userId: request.auth.uid, recipeId: recipe.id });
    
    return { 
      success: true, 
      message: "Recipe saved to your favorites!",
      savedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error("Error saving recipe:", error);
    throw new HttpsError("internal", "Failed to save recipe.");
  }
});

// --- Ingredient Suggestions Function ---
exports.getIngredientSuggestions = onCall(async (request) => {
  // --- Authentication Check ---
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  const { query } = request.data || {};
  
  if (!query || query.length < 2) {
    throw new HttpsError("invalid-argument", "Query must be at least 2 characters");
  }

  try {
    // Mock ingredient database - in real app, this would be from a database
    const INGREDIENT_DATABASE = [
      "tomato", "onion", "garlic", "chicken", "beef", "pork", "fish", "salmon",
      "rice", "pasta", "bread", "potato", "carrot", "broccoli", "spinach",
      "bell pepper", "mushroom", "zucchini", "eggplant", "cucumber",
      "apple", "banana", "orange", "lemon", "lime", "strawberry", "blueberry",
      "cheese", "milk", "butter", "eggs", "flour", "sugar", "salt", "pepper",
      "olive oil", "soy sauce", "vinegar", "herbs", "basil", "oregano", "thyme"
    ];

    const suggestions = INGREDIENT_DATABASE
      .filter(ingredient => ingredient.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
      .map(ingredient => ({
        id: ingredient.replace(/\s+/g, '-'),
        name: ingredient,
        category: getCategoryForIngredient(ingredient)
      }));

    return { suggestions };
  } catch (error) {
    logger.error("Error getting ingredient suggestions:", error);
    throw new HttpsError("internal", "Failed to get suggestions.");
  }
});

function getCategoryForIngredient(ingredient) {
  const categories = {
    vegetables: ["tomato", "onion", "garlic", "potato", "carrot", "broccoli", "spinach", "bell pepper", "mushroom", "zucchini", "eggplant", "cucumber"],
    proteins: ["chicken", "beef", "pork", "fish", "salmon", "eggs"],
    grains: ["rice", "pasta", "bread", "flour"],
    fruits: ["apple", "banana", "orange", "lemon", "lime", "strawberry", "blueberry"],
    dairy: ["cheese", "milk", "butter"],
    pantry: ["salt", "pepper", "olive oil", "soy sauce", "vinegar", "sugar"],
    herbs: ["basil", "oregano", "thyme", "herbs"]
  };

  for (const [category, items] of Object.entries(categories)) {
    if (items.includes(ingredient.toLowerCase())) {
      return category;
    }
  }
  return "other";
}

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

