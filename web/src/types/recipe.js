const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export const mealTypes = [...MEAL_TYPES];

export function createRecipeIdea(overrides = {}) {
  return {
    id: overrides.id ?? '',
    title: overrides.title ?? '',
    description: overrides.description ?? '',
    ingredients: Array.isArray(overrides.ingredients) ? overrides.ingredients : [],
    steps: Array.isArray(overrides.steps) ? overrides.steps : [],
    prepTimeMinutes: overrides.prepTimeMinutes ?? null,
    cookTimeMinutes: overrides.cookTimeMinutes ?? null,
    servings: overrides.servings ?? null
  };
}

export function createPlannedMeal(overrides = {}) {
  const meal = MEAL_TYPES.includes(overrides.meal) ? overrides.meal : MEAL_TYPES[0];
  return {
    id: overrides.id ?? '',
    day: overrides.day ?? '',
    meal,
    recipeTitle: overrides.recipeTitle ?? '',
    recipeId: overrides.recipeId ?? null
  };
}
