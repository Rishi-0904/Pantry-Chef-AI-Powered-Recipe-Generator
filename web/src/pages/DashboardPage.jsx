import { useState } from 'react';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { IngredientList } from '../components/ingredients/IngredientList';
import { RecipeActions } from '../components/recipes/RecipeActions';
import { RecipeList } from '../components/recipes/RecipeList';
import { WeeklyPlan } from '../components/recipes/WeeklyPlan';
import { useRecipeGenerator } from '../hooks/useRecipeGenerator';
import { useAuthContext } from '../contexts/AuthContext';

export function DashboardPage() {
  const [ingredients, setIngredients] = useState([]);
  const { recipes, isLoading, generateRecipes, saveRecipe, plannedMeals } = useRecipeGenerator();
  const { user, signOutUser } = useAuthContext();

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
    <div className="relative min-h-screen overflow-hidden pb-16">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-rose-50 to-amber-100 opacity-90" />
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[url('https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center lg:block opacity-30" />

      <div className="relative">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg">
              🥘
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">Pantry Chef</p>
              <h1 className="font-display text-2xl text-ink">AI Recipe Atelier</h1>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-ink/80 lg:flex">
            <a className="transition hover:text-brand-dark" href="#pantry">
              Pantry
            </a>
            <a className="transition hover:text-brand-dark" href="#recipes">
              Recipes
            </a>
            <a className="transition hover:text-brand-dark" href="#planner">
              Planner
            </a>
            <a className="transition hover:text-brand-dark" href="#chef-notes">
              Chef&apos;s Notes
            </a>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden items-center gap-3 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur lg:flex">
                {user.photoURL ? (
                  <img className="h-8 w-8 rounded-full object-cover" src={user.photoURL} alt={user.displayName ?? 'User avatar'} />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand">
                    {(user.displayName ?? 'Guest').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-semibold text-ink/80">
                  {user.displayName ?? 'Food Explorer'}
                </span>
              </div>
            )}
            <button
              type="button"
              className="pill-button hidden sm:inline-flex"
              onClick={signOutUser}
            >
              Sign out
            </button>
          </div>
        </nav>

        <header className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="glass-panel relative overflow-hidden px-6 py-10 sm:px-10 lg:flex lg:items-center lg:gap-16">
            <div className="absolute -right-24 -top-24 h-52 w-52 rounded-full bg-brand/20 blur-3xl" />
            <div className="absolute -bottom-16 left-32 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />

            <div className="relative z-10 flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-brand">
                Fresh Ideas Daily
              </span>
              <h2 className="max-w-2xl font-display text-4xl text-ink sm:text-5xl">
                Curate vibrant meals from whatever&apos;s already in your kitchen.
              </h2>
              <p className="max-w-2xl text-lg text-ink/70">
                Pantry Chef pairs your on-hand ingredients with chef-crafted flavour profiles and AI creativity. Generate weeknight inspiration, plan nourishing menus, and save your favourites for next time.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="pill-button px-8 py-3 text-base"
                  onClick={() => generateRecipes(ingredients)}
                  disabled={!ingredients.length || isLoading}
                >
                  {isLoading ? 'Simmering ideas…' : 'Generate my menu'}
                </button>
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark" href="#pantry">
                  Explore pantry tools
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="relative z-10 mt-10 grid flex-1 gap-4 sm:grid-cols-2 lg:mt-0">
              <div className="glass-panel flex flex-col gap-2 rounded-2xl px-5 py-6">
                <span className="text-3xl">🥗</span>
                <p className="text-xs uppercase tracking-[0.35em] text-brand">Ingredient roster</p>
                <p className="text-3xl font-semibold text-ink">{ingredients.length || '0'}</p>
                <span className="text-sm text-ink/60">Items ready to cook</span>
              </div>
              <div className="glass-panel flex flex-col gap-2 rounded-2xl px-5 py-6">
                <span className="text-3xl">🍽️</span>
                <p className="text-xs uppercase tracking-[0.35em] text-brand">AI recipes</p>
                <p className="text-3xl font-semibold text-ink">{recipes.length || '0'}</p>
                <span className="text-sm text-ink/60">Curated for your pantry</span>
              </div>
              <div className="glass-panel flex flex-col gap-2 rounded-2xl px-5 py-6 sm:col-span-2">
                <span className="text-3xl">🗓️</span>
                <p className="text-xs uppercase tracking-[0.35em] text-brand">Weekly plan</p>
                <p className="text-3xl font-semibold text-ink">{plannedMeals.length || '0'}</p>
                <span className="text-sm text-ink/60">Slots filled with flavour</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto mt-16 space-y-16 px-4 sm:px-6">
        <section id="pantry" className="glass-panel space-y-8 rounded-3xl p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-heading">Pantry curator</p>
              <h3 className="text-3xl font-semibold text-ink">What&apos;s stocked in your kitchen?</h3>
              <p className="mt-2 max-w-xl text-sm text-ink/70">
                Build a living list of ingredients to guide the generator. Highlight star items you want to use before they fade.
              </p>
            </div>
          </div>

          <IngredientInput onAdd={handleAddIngredient} />
          <IngredientList items={ingredients} onRemove={handleRemoveIngredient} />

          <div className="flex flex-col gap-3 rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink/70">
              Pro tip: add flavours you love—our AI will balance dishes around your favourite herbs, spices, and produce.
            </p>
            <RecipeActions
              disabled={!ingredients.length}
              loading={isLoading}
              onGenerate={() => generateRecipes(ingredients)}
            />
          </div>
        </section>

        <section id="recipes" className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-heading">Chef-crafted inspiration</p>
              <h3 className="text-3xl font-semibold text-ink">Seasonal plates just for you</h3>
              <p className="mt-2 max-w-2xl text-sm text-ink/70">
                Discover dishes styled after Mediterranean bistros, plant-powered cafes, and comforting home favourites.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand">
              {recipes.length || '0'} recipes ready
            </span>
          </div>

          <RecipeList recipes={recipes} onSave={saveRecipe} isLoading={isLoading} />
        </section>

        <section id="planner" className="glass-panel space-y-8 rounded-3xl p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-heading">Weekly tasting menu</p>
              <h3 className="text-3xl font-semibold text-ink">Curate a balanced plate every day</h3>
              <p className="mt-2 max-w-2xl text-sm text-ink/70">
                Your recipes flow into a flexible planner—swap meals, double favourite dinners, or keep weekends open for spontaneity.
              </p>
            </div>
          </div>

          <WeeklyPlan meals={plannedMeals} />
        </section>

        <section id="chef-notes" className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-heading">Chef&apos;s notes</p>
              <h3 className="text-3xl font-semibold text-ink">Elevate each bite</h3>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="glass-panel flex flex-col gap-3 rounded-3xl p-6">
              <span className="text-3xl">🧂</span>
              <h4 className="text-xl font-semibold text-ink">Layer flavour like a pro</h4>
              <p className="text-sm text-ink/70">
                Toast spices in a dry pan before grinding and add a splash of acidity right before serving to wake up every ingredient.
              </p>
            </article>
            <article className="glass-panel flex flex-col gap-3 rounded-3xl p-6">
              <span className="text-3xl">🌶️</span>
              <h4 className="text-xl font-semibold text-ink">Balance heat & sweetness</h4>
              <p className="text-sm text-ink/70">
                Pair warm chilies with honey or roasted root veggies. Your AI menus suggest counterpoints so every bite sings.
              </p>
            </article>
            <article className="glass-panel flex flex-col gap-3 rounded-3xl p-6">
              <span className="text-3xl">🥬</span>
              <h4 className="text-xl font-semibold text-ink">Celebrate seasonality</h4>
              <p className="text-sm text-ink/70">
                Mark seasonal produce in your pantry list—Pantry Chef surfaces recipes that spotlight peak freshness.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
