import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecipeGenerator } from '../hooks/useRecipeGenerator';

const RecipeContext = createContext(undefined);

export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const {
    recipes,
    plannedMeals,
    isLoading,
    error,
    generateRecipes: generator,
    saveRecipe
  } = useRecipeGenerator();

  const addIngredient = useCallback((entry) => {
    if (!entry || !entry.trim()) {
      return;
    }
    const next = entry.trim().toLowerCase();
    setIngredients((prev) => (prev.includes(next) ? prev : [...prev, next]));
  }, []);

  const removeIngredient = useCallback((entry) => {
    setIngredients((prev) => prev.filter((item) => item !== entry));
  }, []);

  const clearIngredients = useCallback(() => {
    setIngredients([]);
  }, []);

  const generateForSelection = useCallback(
    async (selection) => {
      const source = Array.isArray(selection) && selection.length ? selection : ingredients;
      if (!source.length) {
        return;
      }
      await generator(source);
    },
    [generator, ingredients]
  );

  const value = useMemo(
    () => ({
      ingredients,
      addIngredient,
      removeIngredient,
      clearIngredients,
      recipes,
      plannedMeals,
      isLoading,
      error,
      generateRecipes: generateForSelection,
      generateDirect: generator,
      saveRecipe
    }),
    [ingredients, addIngredient, removeIngredient, clearIngredients, recipes, plannedMeals, isLoading, error, generateForSelection, generator, saveRecipe]
  );

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

RecipeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
}
