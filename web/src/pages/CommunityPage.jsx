import { CommunityFeed } from '../components/community/CommunityFeed';

export function CommunityPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="glass-panel rounded-3xl p-8">
          <p className="section-heading">Community</p>
          <h2 className="text-3xl font-semibold text-ink">Share plates, discover new techniques</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            Explore photo-first posts from home chefs, learn from curated cooking classes, and keep your inspiration flowing.
          </p>
        </div>

        <CommunityFeed />
      </section>
    </div>
  );
}
