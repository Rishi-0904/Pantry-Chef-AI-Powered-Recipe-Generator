import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { RecipeActions } from '../components/recipes/RecipeActions';
import { RecipeShowcase } from '../components/recipes/RecipeShowcase';
import { useRecipeContext } from '../contexts/RecipeContext';

export function KitchenPage() {
  const { ingredients, addIngredient, removeIngredient, clearIngredients, generateRecipes, isLoading, cart, kitchenItems, clearCart, recipes } = useRecipeContext();
  const location = useLocation();
  const [selected, setSelected] = useState([]);

  // Auto-select kitchen items (from cart) first, then fallback to pantry
  useEffect(() => {
    if (kitchenItems.length > 0) {
      setSelected(kitchenItems.map(item => item.name));
    } else if (cart.length > 0) {
      setSelected(cart.map(item => item.name));
    } else {
      setSelected(ingredients.slice(0, 5)); // Limit initial selection
    }
  }, [kitchenItems, cart, ingredients]);

  // Combine kitchen items and pantry items for selection
  const allAvailableItems = useMemo(() => {
    const kitchenItemNames = kitchenItems.map(item => item.name);
    const pantryItemNames = ingredients.filter(item => !kitchenItemNames.includes(item));
    return [...kitchenItemNames, ...pantryItemNames];
  }, [kitchenItems, ingredients]);

  const selectableIngredients = useMemo(() => 
    allAvailableItems.map((item) => ({ id: item, label: item })), 
    [allAvailableItems]
  );

  const toggleIngredient = (item) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]));
  };

  const selectedSummary = selected.length
    ? `${selected.length} ingredient${selected.length > 1 ? 's' : ''} ready to cook`
    : 'Select ingredients you want to cook together';

  return (
    <div className="space-y-12">
      <section className="glass-panel space-y-6 rounded-3xl p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Kitchen</p>
            <h2 className="text-3xl font-semibold text-ink">Cook with your ingredients</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              {kitchenItems.length > 0 
                ? `${kitchenItems.length} ingredients from your cart are ready to cook. Add more from your pantry if needed.`
                : 'Select ingredients from your pantry to start cooking.'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="pill-button bg-brand/15 px-4 py-2 text-[11px] font-semibold text-brand"
              onClick={clearIngredients}
              disabled={!ingredients.length}
            >
              Clear kitchen
            </button>
            <Link className="pill-button px-5 py-2 text-[11px]" to="/pantry">
              Back to pantry
            </Link>
          </div>
        </div>

        <IngredientInput onAdd={addIngredient} />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {selectableIngredients.length ? (
            selectableIngredients.map((ingredient) => {
              const isSelected = selected.includes(ingredient.id);
              const isFromCart = kitchenItems.some(item => item.name === ingredient.id);
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  className={`glass-panel flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                    isSelected ? 'ring-2 ring-brand/40 bg-brand/10' : ''
                  } ${isFromCart ? 'border-l-4 border-green-500' : ''}`}
                  onClick={() => toggleIngredient(ingredient.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{ingredient.label}</span>
                    {isFromCart && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        🛒 From Cart
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isSelected 
                        ? 'bg-brand text-white' 
                        : 'bg-brand/15 text-brand'
                    }`}>
                      {isSelected ? '✓ Selected' : 'Tap to cook'}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="pill-button bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 text-[11px] font-semibold transition-colors"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeIngredient(ingredient.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          event.stopPropagation();
                          removeIngredient(ingredient.id);
                        }
                      }}
                    >
                      Remove
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <span className="text-6xl mb-4 block">🍳</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kitchen is empty</h3>
              <p className="text-gray-500 mb-6">Add ingredients to your cart from the pantry to start cooking</p>
              <Link
                to="/pantry"
                className="pill-button bg-brand text-white px-6 py-2 inline-flex items-center gap-2"
              >
                Browse Pantry 🥕
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Cooking session</p>
            <p className="text-sm text-ink/70">{selectedSummary}</p>
          </div>
          <RecipeActions
            disabled={!selected.length}
            loading={isLoading}
            onGenerate={() => generateRecipes(selected)}
          />
        </div>
      </section>

      {/* Recipe Results */}
      <RecipeShowcase 
        recipes={recipes}
        isLoading={isLoading}
        ingredients={selected}
        onGenerateMore={() => generateRecipes(selected)}
      />
    </div>
  );
}
