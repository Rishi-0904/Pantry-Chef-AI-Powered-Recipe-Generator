import PropTypes from 'prop-types';

export function IngredientList({ items, onRemove }) {
  if (!items.length) {
    return <p className="empty-state">No ingredients yet. Add a few to get started.</p>;
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item} className="list-item">
          <span className="tag">{item}</span>
          <button className="button button-secondary" type="button" onClick={() => onRemove(item)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

IngredientList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemove: PropTypes.func.isRequired
};
