import PropTypes from 'prop-types';

export function RecipeActions({ disabled, loading, onGenerate }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <p className="text-xs uppercase tracking-[0.35em] text-ink/40">
        Ready in minutes
      </p>
      <button
        className="pill-button px-6 py-3 text-sm"
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
