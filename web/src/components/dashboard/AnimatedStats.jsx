import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function AnimatedStats({ stats }) {
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    const timers = [];
    
    stats.forEach((stat, index) => {
      const timer = setTimeout(() => {
        if (typeof stat.value === 'number') {
          // Animate numbers
          let current = 0;
          const target = stat.value;
          const increment = target / 30; // 30 steps
          
          const countTimer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(countTimer);
            }
            setAnimatedValues(prev => ({
              ...prev,
              [stat.id]: Math.floor(current)
            }));
          }, 50);
          
          timers.push(countTimer);
        } else {
          // For non-numeric values, just set them
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: stat.value
          }));
        }
      }, index * 200); // Stagger the animations
      
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [stats]);

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.id} 
          className={`glass-panel rounded-3xl border border-white/50 bg-gradient-to-br ${stat.accent} p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slideInUp`}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Floating icons */}
          <div className="absolute top-2 right-2 opacity-20">
            <div className="animate-float text-2xl">
              {getStatIcon(stat.id)}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.35em] text-ink/50 mb-4">
              {stat.label}
            </p>
            
            <div className="mb-4">
              <p className="text-4xl font-semibold text-ink transition-all duration-300">
                {animatedValues[stat.id] !== undefined ? animatedValues[stat.id] : stat.value}
              </p>
              
              {/* Progress bar for percentage values */}
              {typeof stat.value === 'string' && stat.value.includes('%') && (
                <div className="mt-2 w-full bg-white/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-ink/60 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${parseInt(stat.value)}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </div>
              )}
            </div>
            
            <p className="text-xs text-ink/60 leading-relaxed">
              {stat.sublabel}
            </p>

            {/* Sparkle effect on hover */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatIcon(statId) {
  const icons = {
    'pantry-items': '🥕',
    'recipes-curated': '📝',
    'plan-coverage': '📅',
    'pantry-diversity': '🌈'
  };
  return icons[statId] || '📊';
}

AnimatedStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      sublabel: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired
    })
  ).isRequired
};
