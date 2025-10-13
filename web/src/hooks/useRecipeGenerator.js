import { useCallback, useMemo, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { functions, db } from '../services/firebaseApp';
import { useAuthContext } from '../contexts/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];

const fallbackSteps = ['Combine ingredients.', 'Cook until ready.', 'Serve and enjoy.'];

function coerceSteps(recipe) {
  if (Array.isArray(recipe.steps) && recipe.steps.length) {
    return recipe.steps;
  }
  if (Array.isArray(recipe.instructions) && recipe.instructions.length) {
    return recipe.instructions;
  }
  if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
    return recipe.instructions.split(/\n+/).map((step) => step.trim()).filter(Boolean);
  }
  return fallbackSteps;
}

function parseTimeMinutes(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return Math.round(Number(match[1]));
    }
  }
  return undefined;
}

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2)}`;
};

function ensureRecipeShape(recipe = {}, index) {
  const ingredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length
    ? recipe.ingredients
    : ['Your selected ingredients'];
  const steps = coerceSteps(recipe);

  return {
    id: recipe.id || createId(),
    title: recipe.title || `Recipe ${index + 1}`,
    description: recipe.description || 'A delicious meal idea generated from your pantry items.',
    ingredients,
    steps,
    prepTimeMinutes: parseTimeMinutes(recipe.prepTimeMinutes ?? recipe.prepTime),
    cookTimeMinutes: parseTimeMinutes(recipe.cookTimeMinutes ?? recipe.cookTime),
    servings: recipe.servings
  };
}

function buildDefaultWeeklyPlan(recipes) {
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
}

function ensureMealShape(meal = {}, recipes) {
  const fallbackRecipe = recipes[0];
  return {
    id: meal.id || createId(),
    day: meal.day || DAYS[0],
    meal: meal.meal || 'dinner',
    recipeTitle: meal.recipeTitle || fallbackRecipe?.title || 'Meal idea',
    recipeId: meal.recipeId || fallbackRecipe?.id
  };
}

export function useRecipeGenerator() {
  const { user } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipes = useCallback(
    async (ingredients) => {
      if (!ingredients.length) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const callable = httpsCallable(functions, 'generateRecipes');
        const response = await callable({ ingredients });
        const data = response?.data || {};

        const generatedRecipes = Array.isArray(data.recipes)
          ? data.recipes.map((recipe, index) => ensureRecipeShape(recipe, index))
          : [];
        if (!generatedRecipes.length) {
          const defaults = ingredients.slice(0, 3).map((ingredient, index) =>
            ensureRecipeShape(
              {
                title: `${ingredient} showcase`,
                description: `A simple way to highlight ${ingredient}.`,
                ingredients,
                steps: fallbackSteps
              },
              index
            )
          );
          setRecipes(defaults);
          setPlannedMeals(buildDefaultWeeklyPlan(defaults));
          return;
        }

        setRecipes(generatedRecipes);

        const plan = Array.isArray(data.weeklyPlan)
          ? data.weeklyPlan.map((meal) => ensureMealShape(meal, generatedRecipes))
          : [];
        setPlannedMeals(plan.length ? plan : buildDefaultWeeklyPlan(generatedRecipes));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate recipes. Try again.');
        setRecipes([
          ensureRecipeShape({
            title: 'Pantry Power Bowl',
            description: 'Mix your ingredients into a hearty, customizable bowl.',
            ingredients,
            steps: fallbackSteps
          }, 0)
        ]);
        setPlannedMeals(
          buildDefaultWeeklyPlan([
            ensureRecipeShape({
              title: 'Pantry Power Bowl',
              description: 'Mix your ingredients into a hearty, customizable bowl.',
              ingredients,
              steps: fallbackSteps
            }, 0)
          ])
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const saveRecipe = useCallback(
    async (recipe) => {
      if (!user) {
        return;
      }

      const recipeRef = doc(db, 'users', user.uid, 'recipes', recipe.id);
      await setDoc(recipeRef, { ...recipe, createdAt: serverTimestamp() }, { merge: true });
    },
    [user]
  );

  return useMemo(
    () => ({
      recipes,
      plannedMeals,
      isLoading,
      error,
      generateRecipes,
      saveRecipe
    }),
    [recipes, plannedMeals, isLoading, error, generateRecipes, saveRecipe]
  );
}
