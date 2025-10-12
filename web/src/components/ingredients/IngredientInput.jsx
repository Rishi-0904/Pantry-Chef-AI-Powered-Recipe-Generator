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
    <form className="ingredient-input" onSubmit={handleSubmit}>
      <input
        className="input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="e.g. chickpeas, spinach"
      />
      <button className="button" type="submit">
        Add ingredient
      </button>
    </form>
  );
}

IngredientInput.propTypes = {
  onAdd: PropTypes.func.isRequired
};
