import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../services/firebaseApp';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: handleSignIn,
      signOutUser: handleSignOut
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
