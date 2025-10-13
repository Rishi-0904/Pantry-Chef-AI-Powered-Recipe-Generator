import { useMemo } from 'react';
import { WeeklyPlan } from '../components/recipes/WeeklyPlan';
import { RecipeList } from '../components/recipes/RecipeList';
import { RecipeActions } from '../components/recipes/RecipeActions';
import { useRecipeContext } from '../contexts/RecipeContext';

export function PlannerPage() {
  const { plannedMeals, recipes, generateRecipes, isLoading, saveRecipe, ingredients } = useRecipeContext();

  const mealCountCopy = useMemo(() => {
    if (!plannedMeals.length) {
      return 'No meals planned yet';
    }
    if (plannedMeals.length < 7) {
      return `${plannedMeals.length} meals planned — add more variety`;
    }
    if (plannedMeals.length < 21) {
      return `${plannedMeals.length}/21 slots covered`;
    }
    return 'Week fully planned';
  }, [plannedMeals.length]);

  return (
    <div className="space-y-12">
      <section className="glass-panel space-y-6 rounded-3xl p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Weekly planner</p>
            <h2 className="text-3xl font-semibold text-ink">Visualise your tasting menu</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Adjust breakfast, lunch, and dinner for each day. Regenerate ideas whenever you need fresh flavours to keep the week
              exciting.
            </p>
          </div>
          <div className="flex gap-3">
            <RecipeActions
              disabled={!ingredients.length}
              loading={isLoading}
              onGenerate={() => generateRecipes()}
            />
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand">
              {mealCountCopy}
            </span>
          </div>
        </div>

        <WeeklyPlan meals={plannedMeals} />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="section-heading">Generated recipes</p>
          <h3 className="text-2xl font-semibold text-ink">Choose dishes to add into your week</h3>
          <p className="text-sm text-ink/60">Save favourites to your collection or copy details into the planner above.</p>
        </div>
        <RecipeList recipes={recipes} onSave={saveRecipe} isLoading={isLoading} />
      </section>
    </div>
  );
}
