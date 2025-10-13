import { Link } from 'react-router-dom';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { useRecipeContext } from '../contexts/RecipeContext';

export function PantryPage() {
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useRecipeContext();

  return (
    <div className="space-y-12">
      <section className="glass-panel space-y-6 rounded-3xl p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Pantry inventory</p>
            <h2 className="text-3xl font-semibold text-ink">Everything you currently have on hand</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Keep your pantry list up to date so ingredient storage and the planner can suggest the most relevant dishes. Remove
              ingredients as you use them up and add new finds whenever you stock the kitchen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="pill-button bg-brand/15 px-4 py-2 text-[11px] font-semibold text-brand"
              onClick={clearIngredients}
              disabled={!ingredients.length}
            >
              Clear pantry
            </button>
            <Link className="pill-button px-5 py-2 text-[11px]" to="/storage">
              Open ingredient storage
            </Link>
          </div>
        </div>

        <IngredientInput onAdd={addIngredient} />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ingredients.length ? (
            ingredients.map((item) => (
              <div
                key={item}
                className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink shadow-sm"
              >
                <span className="capitalize">{item}</span>
                <button
                  type="button"
                  className="pill-button bg-brand/15 px-3 py-1 text-[11px] font-semibold text-brand"
                  onClick={() => removeIngredient(item)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-white/70 px-4 py-5 text-sm text-ink/60">
              Your pantry is empty. Add ingredients above to start tracking what you own.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
