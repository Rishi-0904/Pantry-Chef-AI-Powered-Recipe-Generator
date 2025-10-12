import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const samplePosts = [
  {
    id: 'sample-1',
    title: 'Summer Herb Gnocchi',
    description: 'Pan-seared gnocchi with blistered tomatoes, lemon zest and basil oil.',
    mediaUrl: 'https://images.unsplash.com/photo-1514516430032-7f38c72b72ff?auto=format&fit=crop&w=900&q=80',
    author: {
      id: 'auth-1',
      name: 'Elio Garcia',
      avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=120&h=120&q=80'
    },
    likes: 142,
    tags: ['gnocchi', 'vegetarian', '30-minutes']
  }
];

export function useCommunityFeed() {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState(samplePosts);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const sharePost = async (payload) => {
    if (!user) {
      setError('You need to sign in to share');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const newPost = {
        id: `local-${Date.now()}`,
        ...payload,
        author: {
          id: user.uid,
          name: user.displayName ?? 'Pantry Chef',
          avatar: user.photoURL ?? 'https://images.unsplash.com/photo-1514516430032-7f38c72b72ff?auto=format&fit=facearea&w=120&h=120&q=80'
        }
      };
      setPosts((previous) => [newPost, ...previous]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to share post.');
    } finally {
      setCreating(false);
    }
  };

  return {
    posts,
    sharePost,
    creating,
    error
  };
}
