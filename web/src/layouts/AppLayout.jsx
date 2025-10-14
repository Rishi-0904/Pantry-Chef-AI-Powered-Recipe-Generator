import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useRecipeContext } from '../contexts/RecipeContext';

const linkClasses = (isActive) => `transition hover:text-brand-dark ${isActive ? 'text-brand-dark' : ''}`;

export function AppLayout() {
  const { user, signOutUser, loading } = useAuthContext();
  const { cart } = useRecipeContext();
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-rose-50 to-amber-100" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[url('https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-30 lg:block" />

      <div className="relative z-10">
        <header className="border-b border-white/30 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg">
                🥘
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-dark">Pantry Chef</p>
                <h1 className="font-display text-2xl text-ink">AI Recipe Atelier</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/70 lg:flex">
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/">
                Home
              </NavLink>
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/pantry">
                Pantry
              </NavLink>
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/kitchen">
                Kitchen
              </NavLink>
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/planner">
                Planner
              </NavLink>
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/community">
                Community
              </NavLink>
              <NavLink className={({ isActive }) => linkClasses(isActive)} to="/learn">
                Learn
              </NavLink>
            </nav>

            <div className="flex items-center gap-3">
              <NavLink to="/pantry" className="relative mr-4">
                <span className="text-2xl">🛒</span>
                {cartTotal > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartTotal}
                  </span>
                )}
              </NavLink>
              {user && !loading ? (
                <div className="hidden items-center gap-3 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur lg:flex">
                  {user.photoURL ? (
                    <img className="h-8 w-8 rounded-full object-cover" src={user.photoURL} alt={user.displayName ?? 'User'} />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand">
                      {(user.displayName ?? 'Guest').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-ink/80">{user.displayName ?? 'Food Explorer'}</span>
                </div>
              ) : null}
              <button
                type="button"
                className="pill-button hidden sm:inline-flex"
                onClick={loading ? undefined : handleSignOut}
                disabled={loading}
              >
                {loading ? 'Loading…' : 'Sign out'}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
