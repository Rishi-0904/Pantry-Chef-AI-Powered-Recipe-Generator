import { useEffect, useMemo, useState } from 'react';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const buildUnsplashSearchUrl = (name) => {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', `${name} ingredient food`);
  url.searchParams.set('orientation', 'squarish');
  url.searchParams.set('per_page', '1');
  url.searchParams.set('content_filter', 'high');
  url.searchParams.set('client_id', UNSPLASH_ACCESS_KEY);
  return url.toString();
};

const fallbackImageForIngredient = (name) =>
  `https://source.unsplash.com/600x600/?${encodeURIComponent(`${name} ingredient, food`)}&orientation=squarish`;

export function useIngredientImages(ingredients) {
  const [imageMap, setImageMap] = useState({});

  const missingIngredients = useMemo(
    () => ingredients.filter((item) => !imageMap[item]),
    [ingredients, imageMap]
  );

  useEffect(() => {
    if (!UNSPLASH_ACCESS_KEY || !missingIngredients.length) {
      return;
    }

    let isCancelled = false;

    const fetchImages = async () => {
      const updates = {};

      await Promise.all(
        missingIngredients.map(async (ingredient) => {
          try {
            const response = await fetch(buildUnsplashSearchUrl(ingredient));
            if (!response.ok) {
              throw new Error(`Unsplash request failed: ${response.status}`);
            }
            const data = await response.json();
            const photo = data?.results?.[0];
            updates[ingredient] = photo?.urls?.small || photo?.urls?.regular || fallbackImageForIngredient(ingredient);
          } catch (error) {
            console.error(error);
            updates[ingredient] = fallbackImageForIngredient(ingredient);
          }
        })
      );

      if (isCancelled || !Object.keys(updates).length) {
        return;
      }

      setImageMap((prev) => ({ ...prev, ...updates }));
    };

    fetchImages();

    return () => {
      isCancelled = true;
    };
  }, [missingIngredients]);

  return imageMap;
}
