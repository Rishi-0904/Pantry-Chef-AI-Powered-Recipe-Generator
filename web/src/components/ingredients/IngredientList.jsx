import PropTypes from 'prop-types';

export function IngredientList({ items, onRemove }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand/30 bg-white/60 p-6 text-center text-sm text-ink/70">
        No ingredients yet. Add a few to get started.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item}
          className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink shadow-sm"
        >
          <span className="tag-chip capitalize">{item}</span>
          <button
            className="inline-flex items-center rounded-full border border-transparent bg-white/80 px-3 py-1 text-xs font-semibold text-ink/70 transition hover:bg-brand hover:text-white"
            type="button"
            onClick={() => onRemove(item)}
          >
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
