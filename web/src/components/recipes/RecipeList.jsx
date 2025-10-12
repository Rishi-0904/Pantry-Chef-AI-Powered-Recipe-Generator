import PropTypes from 'prop-types';

export function RecipeList({ recipes, isLoading, onSave }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="glass-panel h-64 animate-pulse rounded-3xl border border-white/50 bg-white/60"
          />
        ))}
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center space-y-3 rounded-3xl p-10 text-center">
        <span className="text-4xl">🍳</span>
        <p className="max-w-md text-sm text-ink/70">
          No recipes yet. Add ingredients above and let Pantry Chef craft a bespoke tasting menu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe) => (
        <article key={recipe.id} className="glass-panel flex h-full flex-col gap-5 rounded-3xl p-6">
          <header className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">
              Signature dish
            </span>
            <h3 className="text-2xl font-semibold text-ink">{recipe.title}</h3>
            {recipe.description && <p className="text-sm text-ink/70">{recipe.description}</p>}
          </header>

          <section className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.35em] text-brand/70">Ingredients</h4>
            <ul className="grid gap-2 text-sm text-ink/80">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand/60" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          {recipe.steps.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.35em] text-brand/70">Method</h4>
              <ol className="space-y-2 text-sm text-ink/80">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <footer className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink/60">
              {typeof recipe.prepTimeMinutes === 'number' && (
                <span className="rounded-full bg-white/70 px-3 py-1">Prep {recipe.prepTimeMinutes} min</span>
              )}
              {typeof recipe.cookTimeMinutes === 'number' && (
                <span className="rounded-full bg-white/70 px-3 py-1">Cook {recipe.cookTimeMinutes} min</span>
              )}
              {typeof recipe.servings === 'number' && (
                <span className="rounded-full bg-white/70 px-3 py-1">Serves {recipe.servings}</span>
              )}
            </div>
            <button
              className="pill-button px-4 py-2 text-xs"
              type="button"
              onClick={() => onSave(recipe)}
            >
              Save recipe
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
      steps: PropTypes.arrayOf(PropTypes.string),
      prepTimeMinutes: PropTypes.number,
      cookTimeMinutes: PropTypes.number,
      servings: PropTypes.number
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired
};
