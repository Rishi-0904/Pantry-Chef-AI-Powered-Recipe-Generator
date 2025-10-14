import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AnimatedRecipeCard } from './AnimatedRecipeCard';
import { RecipeGenerationLoader } from './RecipeGenerationLoader';

export function RecipeShowcase({ recipes, isLoading, ingredients, onGenerateMore }) {
  const [showLoader, setShowLoader] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setDisplayedRecipes([]);
    } else {
      if (showLoader) {
        // Delay hiding loader to show completion
        setTimeout(() => {
          setShowLoader(false);
          setDisplayedRecipes(recipes);
        }, 1000);
      } else {
        setDisplayedRecipes(recipes);
      }
    }
  }, [isLoading, recipes, showLoader]);

  if (showLoader || isLoading) {
    return <RecipeGenerationLoader isVisible={true} ingredients={ingredients} />;
  }

  if (!displayedRecipes.length) {
    return (
      <div className="text-center py-12">
        <div className="animate-bounce mb-6">
          <span className="text-8xl">🍽️</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Cook?</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Select your ingredients and let our AI chef create amazing recipes just for you!
        </p>
        <div className="flex justify-center">
          <div className="animate-pulse bg-brand/10 text-brand px-6 py-3 rounded-full">
            ✨ Your culinary adventure awaits
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl animate-bounce">🎉</span>
          <h2 className="text-3xl font-bold text-gray-900">Your Personalized Recipes</h2>
          <span className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍳</span>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Created with love using your selected ingredients. Each recipe is crafted to bring out the best flavors!
        </p>
      </div>

      {/* Recipe Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-rose-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-900">{displayedRecipes.length}</div>
          <div className="text-sm text-gray-600">Recipes Generated</div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🥕</div>
          <div className="text-2xl font-bold text-gray-900">{ingredients.length}</div>
          <div className="text-sm text-gray-600">Ingredients Used</div>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">⏱️</div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(displayedRecipes.reduce((acc, recipe) => {
              const prepTime = parseInt(recipe.prepTime) || 15;
              const cookTime = parseInt(recipe.cookTime) || 20;
              return acc + prepTime + cookTime;
            }, 0) / displayedRecipes.length)}m
          </div>
          <div className="text-sm text-gray-600">Avg. Total Time</div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {displayedRecipes.map((recipe, index) => (
          <div
            key={recipe.id || index}
            className="animate-slideInUp"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <AnimatedRecipeCard recipe={recipe} index={index} />
          </div>
        ))}
      </div>

      {/* Generate More Button */}
      <div className="text-center pt-8">
        <button
          onClick={onGenerateMore}
          className="pill-button bg-gradient-to-r from-brand to-brand-dark text-white px-8 py-3 text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center gap-2">
            <span className="animate-spin">✨</span>
            Generate More Recipes
            <span className="animate-spin" style={{ animationDelay: '0.5s' }}>✨</span>
          </span>
        </button>
      </div>

      {/* Cooking Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-semibold text-gray-900">Pro Chef Tips</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-brand">•</span>
            <span>Always taste and adjust seasoning as you cook</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand">•</span>
            <span>Let meat rest after cooking for better texture</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand">•</span>
            <span>Prep all ingredients before you start cooking</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand">•</span>
            <span>High heat for searing, low heat for gentle cooking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

RecipeShowcase.propTypes = {
  recipes: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  ingredients: PropTypes.array.isRequired,
  onGenerateMore: PropTypes.func.isRequired
};
