import { useMemo } from 'react';
import PropTypes from 'prop-types';

const TOTAL_MEAL_SLOTS = 21;

const formatRecipeCount = (count) => {
  if (!count) {
    return 'No recipes yet — generate one to begin';
  }
  if (count === 1) {
    return 'A single dish curated';
  }
  if (count <= 4) {
    return `${count} fresh ideas ready to plate`;
  }
  return `${count} recipes curated this week`;
};

export function UserDashboard({ user, ingredients, recipes, plannedMeals }) {
  const stats = useMemo(() => {
    const pantryCount = ingredients.length;
    const recipeCount = recipes.length;
    const planCoverage = Math.round(Math.min(100, (plannedMeals.length / TOTAL_MEAL_SLOTS) * 100));
    const pantryTokens = new Set(ingredients.map((item) => item.split(' ').pop()));
    const pantryDiversity = Math.min(100, Math.round(pantryTokens.size * 8));

    const recipeCopy = formatRecipeCount(recipeCount);

    return [
      {
        id: 'pantry-items',
        label: 'Pantry items logged',
        value: pantryCount,
        sublabel: 'Keep ingredients fresh and rotating',
        accent: 'from-amber-200 via-amber-100 to-white'
      },
      {
        id: 'recipes-curated',
        label: 'AI recipes curated',
        value: recipeCount,
        sublabel: recipeCopy,
        accent: 'from-orange-200 via-white to-orange-50'
      },
      {
        id: 'plan-coverage',
        label: 'Weekly plan coverage',
        value: `${planCoverage}%`,
        sublabel: `${plannedMeals.length}/${TOTAL_MEAL_SLOTS} meal slots`,
        accent: 'from-rose-200 via-rose-50 to-white'
      },
      {
        id: 'pantry-diversity',
        label: 'Pantry diversity score',
        value: `${pantryDiversity}%`,
        sublabel: 'Variety keeps menus exciting',
        accent: 'from-lime-200 via-white to-emerald-50'
      }
    ];
  }, [ingredients, plannedMeals.length, recipes.length]);

  const upcomingMeals = useMemo(() => plannedMeals.slice(0, 5), [plannedMeals]);

  const activityFeed = useMemo(
    () => [
      {
        id: 'activity-menu',
        icon: '🍳',
        title: 'Menu generated',
        detail: formatRecipeCount(recipes.length),
        time: 'Today'
      },
      {
        id: 'activity-planner',
        icon: '🗓️',
        title: 'Weekly planner updated',
        detail: `${plannedMeals.length} meals organised`,
        time: 'This week'
      },
      {
        id: 'activity-pantry',
        icon: '🥕',
        title: 'Pantry refreshed',
        detail: `${ingredients.length} items on hand`,
        time: 'Just now'
      }
    ],
    [ingredients.length, plannedMeals.length, recipes.length]
  );

  const profile = useMemo(
    () => ({
      name: user?.displayName ?? 'Pantry Chef',
      avatar:
        user?.photoURL ?? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=160&h=160&q=80',
      greeting: `Welcome back, ${user?.displayName?.split(' ')[0] ?? 'chef'}!`
    }),
    [user]
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-3xl bg-white/70 p-8 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <img className="h-16 w-16 rounded-3xl object-cover shadow-xl" src={profile.avatar} alt={profile.name} />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand/70">Personal dashboard</p>
            <h3 className="text-3xl font-semibold text-ink">{profile.greeting}</h3>
            <p className="text-sm text-ink/60">Track your pantry, upcoming menus, and creative kitchen wins at a glance.</p>
          </div>
        </div>
        <div className="rounded-3xl bg-brand/10 px-6 py-4 text-sm font-semibold text-brand">
          Keep the inspiration flowing — add at least 3 new plates this week.
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.id} className={`glass-panel rounded-3xl border border-white/50 bg-gradient-to-br ${item.accent} p-6 shadow-sm`}>
            <p className="text-xs uppercase tracking-[0.35em] text-ink/50">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-ink">{item.value}</p>
            <p className="mt-3 text-xs text-ink/60">{item.sublabel}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Upcoming plates</p>
              <h4 className="mt-1 text-2xl font-semibold text-ink">Next servings on your planner</h4>
            </div>
            <span className="rounded-full bg-brand/15 px-4 py-2 text-xs font-semibold text-brand">
              {plannedMeals.length} meals scheduled
            </span>
          </div>

          <ul className="mt-6 space-y-4">
            {upcomingMeals.length ? (
              upcomingMeals.map((meal) => (
                <li key={meal.id} className="flex items-center gap-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-ink shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-base font-semibold text-brand">
                    {meal.day.slice(0, 2)}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{meal.recipeTitle}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{meal.day} · {meal.meal}</p>
                  </div>
                  <button type="button" className="pill-button bg-brand px-3 py-1.5 text-[11px]">
                    Swap
                  </button>
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-white/70 px-4 py-5 text-sm text-ink/60">Generate a menu to fill your planner.</li>
            )}
          </ul>
        </div>

        <div className="glass-panel flex flex-col gap-5 rounded-3xl p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Kitchen cadence</p>
            <h4 className="mt-1 text-xl font-semibold text-ink">Recent activity</h4>
          </div>
          <ul className="space-y-4">
            {activityFeed.map((item) => (
              <li key={item.id} className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-ink/70 shadow-sm">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-ink/50">{item.detail}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.35em] text-ink/40">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

UserDashboard.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string
  }),
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      ingredients: PropTypes.arrayOf(PropTypes.string),
      steps: PropTypes.arrayOf(PropTypes.string),
      prepTimeMinutes: PropTypes.number,
      cookTimeMinutes: PropTypes.number,
      servings: PropTypes.number
    })
  ).isRequired,
  plannedMeals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      meal: PropTypes.string.isRequired,
      recipeTitle: PropTypes.string.isRequired,
      recipeId: PropTypes.string
    })
  ).isRequired
};

UserDashboard.defaultProps = {
  user: null
};
