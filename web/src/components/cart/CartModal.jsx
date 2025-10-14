import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { useIngredientImages } from '../../hooks/useIngredientImages';

export function CartModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    syncCartToPantry
  } = useRecipeContext();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const cartItemNames = cart.map(item => item.name);
  const imageMap = useIngredientImages(cartItemNames);

  const handleProceedToKitchen = () => {
    if (!cart.length) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      syncCartToPantry();
      clearCart();
      onClose();
      navigate('/kitchen');
    }, 800);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum, item) => sum + (item.quantity * 2.5), 0); // Mock pricing

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
                <p className="text-sm text-gray-500">{cartTotal} items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 ${
                      isAnimating ? 'animate-pulse' : 'hover:bg-gray-100'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <img 
                        src={imageMap[item.name] || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&crop=center`}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 capitalize">{item.name}</h3>
                      <p className="text-sm text-gray-500">${(item.quantity * 2.5).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        disabled={isAnimating}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        disabled={isAnimating}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors ml-2"
                        disabled={isAnimating}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🛒</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add ingredients from your pantry to get started</p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/pantry');
                  }}
                  className="pill-button bg-brand text-white px-6 py-2"
                >
                  Browse Pantry
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">${totalValue.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleProceedToKitchen}
                  disabled={isAnimating}
                  className={`w-full pill-button text-white py-3 font-semibold transition-all duration-300 ${
                    isAnimating 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-brand hover:bg-brand-dark'
                  }`}
                >
                  {isAnimating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Moving to Kitchen...
                    </span>
                  ) : (
                    'Proceed to Kitchen 🍳'
                  )}
                </button>
                
                <button
                  onClick={clearCart}
                  disabled={isAnimating}
                  className="w-full pill-button bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
