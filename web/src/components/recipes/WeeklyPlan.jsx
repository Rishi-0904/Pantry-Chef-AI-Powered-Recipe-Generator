import PropTypes from 'prop-types';

const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

export function WeeklyPlan({ meals }) {
  if (!meals.length) {
    return <p className="empty-state">Generate recipes to build a weekly plan.</p>;
  }

  const mealsByDay = meals.reduce((acc, meal) => {
    acc[meal.day] = acc[meal.day] ?? [];
    acc[meal.day].push(meal);
    return acc;
  }, {});

  return (
    <div className="weekly-plan">
      {Object.entries(mealsByDay).map(([day, dayMeals]) => (
        <section key={day} className="weekly-plan__day">
          <h3>{day}</h3>
          <ul>
            {dayMeals.map((meal) => (
              <li key={meal.id}>
                <span className="weekly-plan__meal-type">{MEAL_LABELS[meal.meal]}</span>
                <span>{meal.recipeTitle}</span>
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
      recipeTitle: PropTypes.string.isRequired
    })
  ).isRequired
};
