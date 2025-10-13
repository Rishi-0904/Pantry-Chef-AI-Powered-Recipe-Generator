import { useEffect, useMemo, useState } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';
import { db } from '../services/firebaseApp';
import { uploadImageToCloudinary } from '../services/cloudinary';

const COMMUNITY_COLLECTION = 'communityPosts';

export function useCommunityFeed() {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const communityRef = collection(db, COMMUNITY_COLLECTION);
    const communityQuery = query(communityRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      communityQuery,
      (snapshot) => {
        const nextPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            mediaUrl: data.mediaUrl,
            cloudinaryId: data.cloudinaryId,
            likes: data.likes ?? 0,
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
            author: {
              id: data.author?.id,
              name: data.author?.name,
              avatar: data.author?.avatar
            }
          };
        });
        setPosts(nextPosts);
      },
      (subscriptionError) => {
        setError(subscriptionError.message ?? 'Unable to load community posts.');
      }
    );

    return () => unsubscribe();
  }, []);

  const sharePost = useMemo(
    () =>
      async ({ title, description, tags, imageFile }) => {
        if (!user) {
          setError('You need to sign in to share');
          return;
        }

        if (!imageFile) {
          setError('An image is required to share a creation.');
          return;
        }

        setCreating(true);
        setError(null);

        try {
          const uploadResult = await uploadImageToCloudinary(imageFile);

          const newPost = {
            title,
            description,
            mediaUrl: uploadResult.url,
            cloudinaryId: uploadResult.publicId,
            likes: 0,
            tags: Array.isArray(tags) ? tags : [],
            author: {
              id: user.uid,
              name: user.displayName ?? 'Pantry Chef',
              avatar: user.photoURL ?? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=120&h=120&q=80'
            },
            createdAt: serverTimestamp()
          };

          await addDoc(collection(db, COMMUNITY_COLLECTION), newPost);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unable to share post.';
          setError(message);
          throw err;
        } finally {
          setCreating(false);
        }
      },
    [user]
  );

  return {
    posts,
    sharePost,
    creating,
    error
  };
}
