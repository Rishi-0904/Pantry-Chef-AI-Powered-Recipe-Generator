const LEARNING_VIDEOS = [
  {
    id: 'video-carbonara',
    title: 'Creamy Roman Carbonara',
    instructor: 'Chef Alessia Bianchi',
    duration: '12 min class',
    level: 'Intermediate',
    description: 'Silky egg emulsions and guanciale rendered to perfection. Master temperature control for the classic sauce.',
    embedUrl: 'https://www.youtube.com/embed/3AAdKl1UYZs?rel=0&modestbranding=1',
    thumbnail: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'video-ramen',
    title: 'Smoky Shoyu Ramen Base',
    instructor: 'Niko Park',
    duration: '15 min class',
    level: 'Advanced',
    description: 'Build layers of flavour with tare, dashi, and aromatic oils. Includes tips for plant-based broth variations.',
    embedUrl: 'https://www.youtube.com/embed/mO03wX4tSfM?rel=0&modestbranding=1',
    thumbnail: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'video-sourdough',
    title: 'Everyday Sourdough Ritual',
    instructor: 'Rivera Kitchen Lab',
    duration: '18 min class',
    level: 'Beginner',
    description: 'From starter refresh to open crumb shaping. Follow a no-fuss schedule that fits weekday baking.',
    embedUrl: 'https://www.youtube.com/embed/1timJlCT3PM?rel=0&modestbranding=1',
    thumbnail: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80'
  }
];

export function LearnPage() {
  return (
    <div className="space-y-16">
      <section className="glass-panel space-y-6 rounded-3xl p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Learning studio</p>
            <h2 className="text-3xl font-semibold text-ink">Video classes to elevate pantry cooking</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Follow guided lessons focused on technique, flavour pairings, and plating finesse. Each class pairs with ingredient tips
              so you can replicate dishes from your own storage list.
            </p>
          </div>
          <span className="rounded-full bg-brand/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand">
            {LEARNING_VIDEOS.length} curated classes
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {LEARNING_VIDEOS.map((video) => (
            <article key={video.id} className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl">
              <div className="relative">
                <img className="h-44 w-full object-cover" src={video.thumbnail} alt={video.title} />
                <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                  {video.level}
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand/70">{video.duration}</p>
                  <h3 className="mt-1 text-xl font-semibold text-ink">{video.title}</h3>
                </div>
                <p className="text-sm text-ink/70">{video.description}</p>
                <div className="flex items-center justify-between text-xs text-ink/60">
                  <span>Instructor: {video.instructor}</span>
                  <a
                    className="pill-button bg-brand px-4 py-2 text-[11px]"
                    href={video.embedUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch class
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="glass-panel rounded-3xl bg-white/75 p-6 text-sm text-ink/70">
          <p className="font-semibold text-ink">Learning lab tips</p>
          <p className="mt-2">
            Prep ingredients before you press play, jot down ratios that resonate, and taste after every technique. Share your class
            recreations in the community feed to inspire fellow pantry chefs.
          </p>
        </div>
      </section>
    </div>
  );
}
