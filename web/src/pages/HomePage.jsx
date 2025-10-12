import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export function HomePage() {
  const { user } = useAuthContext();

  return (
    <div className="space-y-16">
      <section className="glass-panel relative overflow-hidden rounded-3xl p-10 sm:p-14">
        <div className="absolute -right-24 -top-24 h-52 w-52 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-16 left-24 h-44 w-44 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-brand">
              Pantry-first cooking
            </span>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              Cook brilliantly with what you already have.
            </h2>
            <p className="max-w-xl text-base text-ink/70">
              Pantry Chef pairs AI creativity with chef-crafted guides to transform everyday ingredients into seasonal menus, weekly
              planners, and community inspiration.
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <Link className="pill-button px-8 py-3" to={user ? '/dashboard' : '/login'}>
                {user ? 'Go to dashboard' : 'Sign in to start'}
              </Link>
              <Link className="pill-button bg-brand/15 px-6 py-3 text-brand" to="/community">
                Explore community plates
              </Link>
            </div>
          </div>

          <div className="relative grid gap-4">
            <div className="glass-panel rounded-3xl px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Plan smarter</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Weekly cook sessions</h3>
              <p className="mt-2 text-sm text-ink/60">Auto-generate breakfast, lunch, and dinner ideas for the entire week.</p>
            </div>
            <div className="glass-panel rounded-3xl px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Learn techniques</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Guided cooking classes</h3>
              <p className="mt-2 text-sm text-ink/60">Short video lessons to elevate foundational skills and favourite dishes.</p>
            </div>
            <div className="glass-panel rounded-3xl px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Share flavours</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Community feed</h3>
              <p className="mt-2 text-sm text-ink/60">Swap plating inspiration, pantry hacks, and recipe riffs with fellow cooks.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <p className="section-heading">Featured journeys</p>
          <h3 className="text-3xl font-semibold text-ink">Where do you want to start today?</h3>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            to="/pantry"
            className="glass-panel flex h-full flex-col gap-3 rounded-3xl p-6 text-ink transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-3xl">🛒</span>
            <h4 className="text-xl font-semibold">Curate your pantry</h4>
            <p className="text-sm text-ink/70">Log seasonal produce, spices, and staples so AI can suggest balanced dishes.</p>
          </Link>
          <Link
            to="/dashboard"
            className="glass-panel flex h-full flex-col gap-3 rounded-3xl p-6 text-ink transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-3xl">📊</span>
            <h4 className="text-xl font-semibold">Track your cooking</h4>
            <p className="text-sm text-ink/70">Review weekly meal coverage, pantry diversity, and favourite saved recipes.</p>
          </Link>
          <Link
            to="/planner"
            className="glass-panel flex h-full flex-col gap-3 rounded-3xl p-6 text-ink transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-3xl">🗓️</span>
            <h4 className="text-xl font-semibold">Schedule your plates</h4>
            <p className="text-sm text-ink/70">Drag-and-drop or regenerate daily meals for a full tasting menu each week.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
