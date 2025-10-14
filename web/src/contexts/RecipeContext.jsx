import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecipeGenerator } from '../hooks/useRecipeGenerator';

const RecipeContext = createContext(undefined);

// Default catalog items with popular ingredients
const DEFAULT_CATALOG_ITEMS = [
  { id: 'tomato', name: 'Tomato', imageUrl: '' },
  { id: 'onion', name: 'Onion', imageUrl: '' },
  { id: 'garlic', name: 'Garlic', imageUrl: '' },
  { id: 'chicken', name: 'Chicken', imageUrl: '' },
  { id: 'rice', name: 'Rice', imageUrl: '' },
  { id: 'egg', name: 'Egg', imageUrl: '' },
  { id: 'milk', name: 'Milk', imageUrl: '' },
  { id: 'butter', name: 'Butter', imageUrl: '' },
  { id: 'flour', name: 'Flour', imageUrl: '' },
  { id: 'potato', name: 'Potato', imageUrl: '' },
  { id: 'carrot', name: 'Carrot', imageUrl: '' },
  { id: 'spinach', name: 'Spinach', imageUrl: '' },
  { id: 'apple', name: 'Apple', imageUrl: '' },
  { id: 'banana', name: 'Banana', imageUrl: '' },
  { id: 'bread', name: 'Bread', imageUrl: '' },
  { id: 'cheese', name: 'Cheese', imageUrl: '' },
];

export function RecipeProvider({ children }) {
  const [catalogItems, setCatalogItems] = useState(DEFAULT_CATALOG_ITEMS);
  const [pantryItems, setPantryItems] = useState([]); // array of { id, name, quantity, imageUrl }
  const [cart, setCart] = useState([]); // array of { id, name, quantity, imageUrl }
  const {
    recipes,
    plannedMeals,
    isLoading,
    error,
    generateRecipes: generator,
    saveRecipe
  } = useRecipeGenerator();

  // Derive ingredients from pantry items for backward compatibility
  const ingredients = useMemo(() => pantryItems.map(item => item.name), [pantryItems]);

  const addIngredient = useCallback((entry) => {
    if (!entry || !entry.trim()) {
      return;
    }
    const name = entry.trim().toLowerCase();
    const id = name.replace(/\s+/g, '-');
    setPantryItems((prev) => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, name, quantity: 1, imageUrl: '' }];
    });
  }, []);

  const removeIngredient = useCallback((entry) => {
    setPantryItems((prev) => prev.filter((item) => item.name !== entry));
  }, []);

  const clearIngredients = useCallback(() => {
    setPantryItems([]);
  }, []);

  // Cart helpers
  const addToCart = useCallback((id) => {
    const item = pantryItems.find(p => p.id === id);
    if (!item) return;
    setCart((prev) => {
      const existing = prev.find(c => c.id === id);
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, [pantryItems]);

  const updateCartQuantity = useCallback((id, delta) => {
    setCart((prev) => prev.map(c => 
      c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c
    ).filter(c => c.quantity > 0));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter(c => c.id !== id));
  }, []);

  const syncCartToPantry = useCallback(() => {
    setPantryItems((prev) => 
      prev.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          return { ...p, quantity: Math.max(0, p.quantity - cartItem.quantity) };
        }
        return p;
      }).filter(p => p.quantity > 0)
    );
    setCart([]);
  }, [cart]);

  const confirmRemoval = useCallback((id, reason) => {
    setPantryItems((prev) => prev.filter(p => p.id !== id));
    // Note: reason can be used for analytics or logging
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
      catalogItems,
      pantryItems,
      cart,
      ingredients, // backward compatibility
      addIngredient,
      removeIngredient,
      clearIngredients,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      syncCartToPantry,
      confirmRemoval,
      recipes,
      plannedMeals,
      isLoading,
      error,
      generateRecipes: generateForSelection,
      generateDirect: generator,
      saveRecipe
    }),
    [
      catalogItems,
      pantryItems,
      cart,
      ingredients,
      addIngredient,
      removeIngredient,
      clearIngredients,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      syncCartToPantry,
      confirmRemoval,
      recipes,
      plannedMeals,
      isLoading,
      error,
      generateForSelection,
      generator,
      saveRecipe
    ]
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
