import PropTypes from 'prop-types';

export function RecipeList({ recipes, isLoading, onSave }) {
  if (isLoading) {
    return <p className="status">Generating delicious ideas…</p>;
  }

  if (!recipes.length) {
    return <p className="empty-state">No recipes yet. Add ingredients and generate a menu.</p>;
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <article key={recipe.id} className="recipe-card">
          <header className="recipe-card__header">
            <h3>{recipe.title}</h3>
            <p className="recipe-card__description">{recipe.description}</p>
          </header>

          <section className="recipe-card__section">
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </section>

          {recipe.steps.length > 0 && (
            <section className="recipe-card__section">
              <h4>Steps</h4>
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          <footer className="recipe-card__footer">
            <div className="recipe-card__meta">
              {recipe.prepTimeMinutes != null && typeof recipe.prepTimeMinutes === 'number' && (
                <span>Prep {recipe.prepTimeMinutes} min</span>
              )}
              {recipe.cookTimeMinutes != null && typeof recipe.cookTimeMinutes === 'number' && (
                <span>Cook {recipe.cookTimeMinutes} min</span>
              )}
              {recipe.servings != null && typeof recipe.servings === 'number' && <span>Serves {recipe.servings}</span>}
              {typeof recipe.servings === 'number' && <span>Serves {recipe.servings}</span>}
            </div>
            <button className="button" type="button" onClick={() => onSave(recipe)}>
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
