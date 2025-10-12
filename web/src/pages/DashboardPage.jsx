import { useState } from 'react';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { IngredientList } from '../components/ingredients/IngredientList';
import { RecipeActions } from '../components/recipes/RecipeActions';
import { RecipeList } from '../components/recipes/RecipeList';
import { WeeklyPlan } from '../components/recipes/WeeklyPlan';
import { useRecipeGenerator } from '../hooks/useRecipeGenerator';

export function DashboardPage() {
  const [ingredients, setIngredients] = useState([]);
  const { recipes, isLoading, generateRecipes, saveRecipe, plannedMeals } = useRecipeGenerator();

  const handleAddIngredient = (item) => {
    setIngredients((prev) => {
      if (!item.trim() || prev.includes(item.trim().toLowerCase())) {
        return prev;
      }
      return [...prev, item.trim().toLowerCase()];
    });
  };

  const handleRemoveIngredient = (item) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient !== item));
  };

  return (
    <div className="app-shell">
      <header className="header">
        <h1>Pantry Chef</h1>
        <p>Turn pantry ingredients into meal inspiration.</p>
      </header>

      <main className="content">
        <section className="panel">
          <h2>My Pantry</h2>
          <IngredientInput onAdd={handleAddIngredient} />
          <IngredientList items={ingredients} onRemove={handleRemoveIngredient} />
          <RecipeActions
            disabled={!ingredients.length}
            loading={isLoading}
            onGenerate={() => generateRecipes(ingredients)}
          />
        </section>

        <section className="panel">
          <h2>Suggested Recipes</h2>
          <RecipeList recipes={recipes} onSave={saveRecipe} isLoading={isLoading} />
        </section>

        <section className="panel">
          <h2>Weekly Planner</h2>
          <WeeklyPlan meals={plannedMeals} />
        </section>
      </main>
    </div>
  );
}
