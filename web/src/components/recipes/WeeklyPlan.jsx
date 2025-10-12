import PropTypes from 'prop-types';

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

export function WeeklyPlan({ meals }) {
  if (!meals.length) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center space-y-3 rounded-3xl p-10 text-center">
        <span className="text-4xl">🗓️</span>
        <p className="max-w-sm text-sm text-ink/70">
          Generate recipes above to automatically fill a week of balanced meals.
        </p>
      </div>
    );
  }

  const mealsByDay = meals.reduce((acc, meal) => {
    acc[meal.day] = acc[meal.day] ?? [];
    acc[meal.day].push(meal);
    return acc;
  }, {});

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {Object.entries(mealsByDay).map(([day, dayMeals]) => (
        <section key={day} className="glass-panel flex flex-col gap-4 rounded-3xl p-6">
          <header className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-ink">{day}</h3>
            <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              {dayMeals.length} meals
            </span>
          </header>
          <ul className="space-y-3">
            {dayMeals.map((meal) => (
              <li
                key={meal.id}
                className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-ink/80 shadow-sm"
              >
                <span className="tag-chip min-w-[90px] text-center uppercase tracking-[0.25em]">
                  {MEAL_LABELS[meal.meal] ?? meal.meal}
                </span>
                <span className="font-medium text-ink">{meal.recipeTitle}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

WeeklyPlan.propTypes = {
  meals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      meal: PropTypes.string.isRequired,
      recipeTitle: PropTypes.string.isRequired,
      recipeId: PropTypes.string
    })
  ).isRequired
};
