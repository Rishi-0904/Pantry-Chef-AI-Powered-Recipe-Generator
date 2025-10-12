import { useState } from 'react';
import PropTypes from 'prop-types';

export function IngredientInput({ onAdd }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    onAdd(value);
    setValue('');
  };

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        <input
          className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-sm text-ink shadow-inner outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/40"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="e.g. chickpeas, spinach"
        />
        <div className="pointer-events-none absolute inset-y-0 right-4 hidden items-center text-xs uppercase tracking-[0.4em] text-brand/60 sm:flex">
          pantry
        </div>
      </div>
      <button className="pill-button px-6 py-3 text-sm sm:px-10" type="submit">
        Add ingredient
      </button>
    </form>
  );
}

IngredientInput.propTypes = {
  onAdd: PropTypes.func.isRequired
};
