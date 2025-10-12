import PropTypes from 'prop-types';

export function RecipeActions({ disabled, loading, onGenerate }) {
  return (
    <div className="actions">
      <button
        className="button"
        type="button"
        onClick={onGenerate}
        disabled={disabled || loading}
        aria-busy={loading}
      >
        {loading ? 'Generating recipes…' : 'Generate recipes'}
      </button>
    </div>
  );
}

RecipeActions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onGenerate: PropTypes.func.isRequired
};
