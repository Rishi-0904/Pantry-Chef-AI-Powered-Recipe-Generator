import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export function LoginPage() {
  const { user, loading, signIn } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const from = location.state?.from?.pathname ?? '/';

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [loading, user, navigate, from]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signIn();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome to Pantry Chef</h1>
        <p>Sign in with Google to turn your pantry items into personalised meal plans.</p>

        {error && <p className="status status-error">{error}</p>}

        <button className="button" type="button" onClick={handleSignIn} disabled={isSigningIn}>
          {isSigningIn ? 'Signing in…' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}
