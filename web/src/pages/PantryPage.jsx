import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IngredientInput } from '../components/ingredients/IngredientInput';
import { AnimatedIngredientCard } from '../components/ingredients/AnimatedIngredientCard';
import { RemoveConfirmationModal } from '../components/ingredients/RemoveConfirmationModal';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useIngredientImages } from '../hooks/useIngredientImages';

export function PantryPage() {
  const {
    pantryItems,
    catalogItems,
    cart,
    addIngredient,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    syncCartToPantry,
    clearCart,
    confirmRemoval,
    generateRecipes
  } = useRecipeContext();
  const navigate = useNavigate();
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Use the hook for image fetching
  const allIngredientNames = [...pantryItems.map(i => i.name), ...catalogItems.map(i => i.name), ...cart.map(i => i.name)];
  const imageMap = useIngredientImages(allIngredientNames);

  useEffect(() => {
    const timer = setTimeout(() => setIsFridgeOpen(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (id) => {
    addToCart(id);
    setToastMessage('Added to cart!');
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleRemoveClick = (item) => {
    setRemovingItem(item);
  };

  const handleRemoveConfirm = (reason) => {
    confirmRemoval(removingItem.id, reason);
    setRemovingItem(null);
  };

  const handleProceedToKitchen = () => {
    if (!cart.length) {
      setToastMessage('Add items to your cart before proceeding.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    const stagedItems = syncCartToPantry();
    if (!stagedItems.length) {
      setToastMessage('Unable to stage cart items. Try again.');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    clearCart();
    navigate('/kitchen');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-12">
      {/* Header with Cart Icon */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pantry</h1>
        <div className="relative">
          <span className="text-2xl">🛒</span>
          {cartTotal > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartTotal}
            </span>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Product Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="section-heading">Pantry inventory</p>
              <h2 className="text-4xl font-semibold text-ink">Freshly stocked and ready to cook</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-ink/70">
                Browse your pantry items and add them to your cart for cooking.
              </p>
            </div>
          </div>

          <IngredientInput onAdd={addIngredient} />

          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {pantryItems.length ? (
              pantryItems.map((item) => {
                const imageSrc = imageMap[item.name] || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&crop=center`;
                const isInCart = cart.some(cartItem => cartItem.id === item.id);
                return (
                  <AnimatedIngredientCard
                    key={item.id}
                    item={item}
                    imageSrc={imageSrc}
                    onAddToCart={handleAddToCart}
                    onRemove={handleRemoveClick}
                    isInCart={isInCart}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="animate-bounce mb-4">
                  <span className="text-6xl">🥕</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your pantry is empty</h3>
                <p className="text-gray-500 mb-6">Add some fresh ingredients to get started with cooking</p>
                <div className="flex justify-center">
                  <div className="animate-pulse bg-brand/10 text-brand px-4 py-2 rounded-full text-sm">
                    ✨ Start by adding ingredients above
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
            {cart.length ? (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={imageMap[item.name] || ''} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                          onClick={() => updateCartQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                          onClick={() => updateCartQuantity(item.id, 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full pill-button block text-center"
                    onClick={handleProceedToKitchen}
                  >
                    Proceed to Kitchen
                  </button>
                  <button
                    className="w-full pill-button bg-blue-100 text-blue-700"
                    onClick={() => generateRecipes(cart.map(item => item.name))}
                  >
                    Generate Recipes from Cart
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">Your cart is empty</p>
            )}
          </div>
        </div>
      </div>

      <RemoveConfirmationModal
        isOpen={!!removingItem}
        onClose={() => setRemovingItem(null)}
        onConfirm={handleRemoveConfirm}
        ingredientName={removingItem?.name || ''}
      />
    </div>
  );
}
