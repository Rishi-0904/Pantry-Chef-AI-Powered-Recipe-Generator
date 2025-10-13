import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { RecipeActions } from '../components/recipes/RecipeActions';
import { useRecipeContext } from '../contexts/RecipeContext';

export function StoragePage() {
  const { ingredients, addIngredient, removeIngredient, clearIngredients, generateRecipes, isLoading } = useRecipeContext();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected((prev) => prev.filter((item) => ingredients.includes(item)));
  }, [ingredients]);

  const selectableIngredients = useMemo(() => ingredients.map((item) => ({ id: item, label: item })), [ingredients]);

  const toggleIngredient = (item) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]));
  };

  const selectedSummary = selected.length
    ? `${selected.length} ingredient${selected.length > 1 ? 's' : ''} ready to pair`
    : 'Select ingredients you want to cook together';

  return (
    <div className="space-y-12">
      <section className="glass-panel space-y-6 rounded-3xl p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Ingredient storage</p>
            <h2 className="text-3xl font-semibold text-ink">Organise items for your next meal</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Add every ingredient you currently own, then select the ones you want to cook together. Pantry Chef will suggest dishes
              that showcase those flavours.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="pill-button bg-brand/15 px-4 py-2 text-[11px] font-semibold text-brand"
              onClick={clearIngredients}
              disabled={!ingredients.length}
            >
              Clear storage
            </button>
            <Link className="pill-button px-5 py-2 text-[11px]" to="/pantry">
              View pantry list
            </Link>
          </div>
        </div>

        <IngredientInput onAdd={addIngredient} />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {selectableIngredients.length ? (
            selectableIngredients.map((ingredient) => {
              const isSelected = selected.includes(ingredient.id);
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  className={`glass-panel flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                    isSelected ? 'ring-2 ring-brand/40 bg-brand/10' : ''
                  }`}
                  onClick={() => toggleIngredient(ingredient.id)}
                >
                  <span className="capitalize">{ingredient.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
                      {isSelected ? 'Selected' : 'Tap to pair'}
                    </span>
                    <button
                      type="button"
                      className="pill-button bg-brand/15 px-3 py-1 text-[11px] font-semibold text-brand"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeIngredient(ingredient.id);
                      }}
                    >
                      Remove
                    </button>
                  </span>
                </button>
              );
            })
          ) : (
            <p className="rounded-2xl bg-white/70 px-4 py-5 text-sm text-ink/60">
              Add a few items above to start building your storage list.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Ingredient pairings</p>
            <p className="text-sm text-ink/70">{selectedSummary}</p>
          </div>
          <RecipeActions
            disabled={!selected.length}
            loading={isLoading}
            onGenerate={() => generateRecipes(selected)}
          />
        </div>
      </section>
    </div>
  );
}
