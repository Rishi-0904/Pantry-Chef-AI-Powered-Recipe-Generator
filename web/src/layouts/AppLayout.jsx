import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const linkClasses = (isActive) => `transition hover:text-brand-dark ${isActive ? 'text-brand-dark' : ''}`;

export function AppLayout() {
  const { user, signOutUser, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-clay via-white to-orange-50">
      <header className="border-b border-white/30 bg-white/60 backdrop-blur">
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
            <NavLink className={({ isActive }) => linkClasses(isActive)} to="/planner">
              Planner
            </NavLink>
            <NavLink className={({ isActive }) => linkClasses(isActive)} to="/community">
              Community
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
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
  );
}
