import { useState } from 'react';
import PropTypes from 'prop-types';

export function AnimatedRecipeCard({ recipe, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const animationDelay = `${index * 150}ms`;

  return (
    <div 
      className={`recipe-card group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
        isExpanded ? 'col-span-full' : ''
      }`}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-orange-200 via-rose-100 to-amber-200 opacity-0 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : ''
      }`} />

      {/* Floating cooking icons */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🍳', '🔥', '✨', '🥄', '🧄', '🌿'].map((icon, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce opacity-70"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${10 + (i % 2) * 20}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '3s'
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🍽️</span>
              <span className="text-xs uppercase tracking-wider text-brand/70 font-semibold">
                Recipe #{index + 1}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {recipe.description}
            </p>
          </div>
          
          <button
            onClick={handleSave}
            className={`ml-4 p-2 rounded-full transition-all duration-300 ${
              isSaved 
                ? 'bg-green-500 text-white animate-pulse' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {isSaved ? '✓' : '♡'}
          </button>
        </div>

        {/* Recipe Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>Prep: {recipe.prepTime || '15 min'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span>Cook: {recipe.cookTime || '20 min'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>Serves: {recipe.servings || 2}</span>
          </div>
        </div>

        {/* Ingredients Preview */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>🥕</span>
            Ingredients ({recipe.ingredients?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            {(recipe.ingredients || []).slice(0, isExpanded ? undefined : 4).map((ingredient, i) => (
              <span
                key={i}
                className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium animate-fadeIn"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {typeof ingredient === 'string' ? ingredient : ingredient.item || ingredient}
              </span>
            ))}
            {!isExpanded && (recipe.ingredients || []).length > 4 && (
              <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                +{(recipe.ingredients || []).length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Instructions Preview/Full */}
        {(recipe.instructions || recipe.steps) && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>📝</span>
              Instructions
            </h4>
            <div className={`space-y-2 ${isExpanded ? '' : 'max-h-20 overflow-hidden'}`}>
              {(recipe.instructions || recipe.steps || []).map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 text-sm text-gray-700 animate-slideIn"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="flex-1">{step}</p>
                </div>
              ))}
            </div>
            {!isExpanded && (recipe.instructions || recipe.steps || []).length > 2 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent" />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 pill-button bg-brand text-white hover:bg-brand-dark transition-all duration-300 transform hover:scale-105"
          >
            {isExpanded ? '📖 Show Less' : '📖 View Full Recipe'}
          </button>
          
          <button className="pill-button bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 transition-all duration-300 transform hover:scale-105">
            🍳 Start Cooking
          </button>
          
          <button className="pill-button bg-green-100 text-green-700 hover:bg-green-200 px-4 transition-all duration-300 transform hover:scale-105">
            📅 Plan Meal
          </button>
        </div>
      </div>

      {/* Cooking difficulty indicator */}
      <div className="absolute top-4 right-4">
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 rounded-full ${
                level <= (recipe.difficulty || 2) 
                  ? 'bg-brand animate-pulse' 
                  : 'bg-gray-200'
              }`}
              style={{ animationDelay: `${level * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

AnimatedRecipeCard.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    ingredients: PropTypes.array,
    instructions: PropTypes.array,
    steps: PropTypes.array,
    prepTime: PropTypes.string,
    cookTime: PropTypes.string,
    servings: PropTypes.number,
    difficulty: PropTypes.number
  }).isRequired,
  index: PropTypes.number
};
