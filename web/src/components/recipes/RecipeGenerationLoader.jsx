import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const COOKING_STEPS = [
  { icon: '🔍', text: 'Analyzing your ingredients...', duration: 2000 },
  { icon: '🧠', text: 'AI chef is thinking...', duration: 2500 },
  { icon: '📝', text: 'Crafting perfect recipes...', duration: 2000 },
  { icon: '✨', text: 'Adding finishing touches...', duration: 1500 },
  { icon: '🍽️', text: 'Ready to serve!', duration: 1000 }
];

const COOKING_QUOTES = [
  "Great recipes are born from fresh ingredients! 👨‍🍳",
  "Every ingredient has a story to tell... 📖",
  "Cooking is love made visible ❤️",
  "The secret ingredient is always passion! 🔥",
  "Good food brings people together 🤝"
];

export function RecipeGenerationLoader({ isVisible, ingredients = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepTimer;
    let progressTimer;
    let quoteTimer;

    const startStep = (stepIndex) => {
      if (stepIndex >= COOKING_STEPS.length) return;
      
      setCurrentStep(stepIndex);
      const step = COOKING_STEPS[stepIndex];
      
      // Progress animation
      const progressIncrement = 100 / COOKING_STEPS.length;
      const startProgress = stepIndex * progressIncrement;
      const endProgress = (stepIndex + 1) * progressIncrement;
      
      let currentProgress = startProgress;
      progressTimer = setInterval(() => {
        currentProgress += 2;
        if (currentProgress <= endProgress) {
          setProgress(currentProgress);
        }
      }, step.duration / 50);

      stepTimer = setTimeout(() => {
        clearInterval(progressTimer);
        startStep(stepIndex + 1);
      }, step.duration);
    };

    // Quote rotation
    quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % COOKING_QUOTES.length);
    }, 3000);

    startStep(0);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
      clearInterval(quoteTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">
            {COOKING_STEPS[currentStep]?.icon || '🍳'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cooking Up Something Special
          </h2>
          <p className="text-gray-600">
            {COOKING_STEPS[currentStep]?.text || 'Preparing your recipes...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Ingredients Being Used */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🥕</span>
            Using Your Ingredients:
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.slice(0, 6).map((ingredient, index) => (
              <span
                key={index}
                className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animationDuration: '0.5s'
                }}
              >
                {ingredient}
              </span>
            ))}
            {ingredients.length > 6 && (
              <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                +{ingredients.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Cooking Quote */}
        <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <p className="text-sm text-gray-700 italic animate-fadeIn" key={currentQuote}>
            {COOKING_QUOTES[currentQuote]}
          </p>
        </div>

        {/* Animated cooking elements */}
        <div className="flex justify-center mt-6 space-x-4">
          {['🥄', '🍳', '🔥'].map((icon, index) => (
            <div
              key={index}
              className="text-2xl animate-bounce"
              style={{ 
                animationDelay: `${index * 300}ms`,
                animationDuration: '2s'
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

RecipeGenerationLoader.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string)
};
