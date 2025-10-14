import PropTypes from 'prop-types';

export function RemoveConfirmationModal({ isOpen, onClose, onConfirm, ingredientName }) {
  if (!isOpen) return null;

  const handleConfirm = (reason) => {
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8">
        <h3 className="text-xl font-semibold text-ink mb-4">Remove {ingredientName}?</h3>
        <p className="text-sm text-ink/70 mb-6">
          Why are you removing this ingredient? This helps us track your pantry better.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            className="w-full pill-button bg-red-100 text-red-700 hover:bg-red-200"
            onClick={() => handleConfirm('used_up')}
          >
            Used up
          </button>
          <button
            type="button"
            className="w-full pill-button bg-orange-100 text-orange-700 hover:bg-orange-200"
            onClick={() => handleConfirm('spoiled')}
          >
            Spoiled
          </button>
          <button
            type="button"
            className="w-full pill-button bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => handleConfirm('other')}
          >
            Other
          </button>
        </div>
        <button
          type="button"
          className="mt-6 w-full pill-button bg-gray-200 text-gray-800 hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

RemoveConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  ingredientName: PropTypes.string.isRequired,
};
