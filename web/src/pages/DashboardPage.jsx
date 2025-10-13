import { Link } from 'react-router-dom';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { useAuthContext } from '../contexts/AuthContext';
import { useRecipeContext } from '../contexts/RecipeContext';

export function DashboardPage() {
  const { user } = useAuthContext();
  const { ingredients, recipes, plannedMeals } = useRecipeContext();

  return (
    <div className="space-y-16">
      <UserDashboard
        user={user}
        ingredients={ingredients}
        recipes={recipes}
        plannedMeals={plannedMeals}
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <Link
          to="/pantry"
          className="glass-panel flex h-full flex-col gap-3 rounded-3xl p-6 text-ink transition hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="text-3xl">🛒</span>
          <h3 className="text-xl font-semibold">Manage pantry</h3>
          <p className="text-sm text-ink/70">Curate ingredients you own and select combinations for AI recipes.</p>
        </Link>
        <Link
          to="/planner"
          className="glass-panel flex h-full flex-col gap-3 rounded-3xl p-6 text-ink transition hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="text-3xl">🗓️</span>
          <h3 className="text-xl font-semibold">Weekly planner</h3>
          <p className="text-sm text-ink/70">Edit your tasting menu, swap dishes, and keep every meal intentional.</p>
        </Link>
        <Link
          to="/community"
          className="glass-panel flex h-full flex-col gap-3 rounded-3xl p-6 text-ink transition hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="text-3xl">🍽️</span>
          <h3 className="text-xl font-semibold">Community inspiration</h3>
          <p className="text-sm text-ink/70">Browse shared plates, notes, and learning videos from fellow cooks.</p>
        </Link>
      </section>
    </div>
  );
}
