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
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-rose-100" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg">
              🥘
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-dark">Pantry Chef</p>
              <h1 className="font-display text-xl text-ink">AI Recipe Atelier</h1>
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm font-semibold text-ink/70 sm:flex">
            <span className="transition hover:text-brand-dark">How it works</span>
            <span className="transition hover:text-brand-dark">Testimonials</span>
            <span className="transition hover:text-brand-dark">Pricing</span>
          </div>
        </nav>

        <main className="mt-16 flex flex-1 flex-col items-center justify-center gap-12 lg:flex-row lg:items-stretch">
          <div className="glass-panel relative flex max-w-xl flex-1 flex-col justify-center gap-6 rounded-3xl px-8 py-10">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-brand/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-brand">
              Cook smarter
            </span>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              Transform leftover ingredients into chef-level meals.
            </h2>
            <p className="text-base text-ink/70">
              Pantry Chef analyses what&apos;s already in your kitchen then co-creates flavour-packed menus tailored to your taste, dietary preferences, and time.
            </p>
            <ul className="grid gap-4 text-sm text-ink/70">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-brand">1</span>
                Instantly capture pantry staples and fresh finds.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-brand">2</span>
                Generate creative, seasonal recipes in seconds.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-brand">3</span>
                Plan a balanced week with AI-assisted menu curation.
              </li>
            </ul>
          </div>

          <div className="glass-panel flex max-w-md flex-1 flex-col gap-6 rounded-3xl px-8 py-10">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Step into the kitchen</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">Sign in with Google</h3>
            </div>

            {error && (
              <p className="rounded-2xl bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-700 shadow">
                {error}
              </p>
            )}

            <button
              className="pill-button w-full justify-center gap-3 py-3 text-sm"
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              <span className="text-lg">🔐</span>
              {isSigningIn ? 'Signing in…' : 'Continue with Google'}
            </button>

            <div className="grid gap-3 rounded-2xl bg-white/70 p-5 text-xs text-ink/70">
              <p className="font-semibold uppercase tracking-[0.35em] text-brand/80">What you get</p>
              <p>Personalised recipe inspiration sourced from your pantry staples.</p>
              <p>Weekly menu planning with quick swaps for busy nights.</p>
              <p>Private storage for favourite dishes and AI cooking tips.</p>
            </div>

            <p className="text-center text-xs text-ink/50">
              By continuing you agree to our kitchen etiquette & privacy policy.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
