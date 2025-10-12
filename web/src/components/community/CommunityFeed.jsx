import { useMemo } from 'react';
import { useCommunityFeed } from '../../hooks/useCommunityFeed';

const COMMUNITY_POSTS = [
  {
    id: 'saffron-morning-buns',
    title: 'Saffron Morning Buns',
    creator: 'Mira Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=120&h=120&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description:
      'Laminated pastry layered with cardamom butter, saffron syrup glaze, and candied orange zest. Perfect with a silky masala chai.',
    tags: ['pastry', 'vegetarian', 'brunch'],
    likes: 324
  },
  {
    id: 'smokehouse-ramen',
    title: 'Smoked Mushroom Ramen',
    creator: 'Niko Park',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=120&h=120&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1200&q=80',
    description:
      'Charred shiitake, soy-braised bamboo, and smoked tare broth poured tableside. Finished with chilli oil from pantry staples.',
    tags: ['ramen', 'vegan', 'smoked'],
    likes: 281
  },
  {
    id: 'midnight-gelato',
    title: 'Midnight Olive Oil Gelato',
    creator: 'Luca Rojas',
    avatar: 'https://images.unsplash.com/photo-1544723795-432537b03125?auto=format&fit=facearea&w=120&h=120&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?auto=format&fit=crop&w=1200&q=80',
    description:
      'Deep, peppery arbequina olive oil spun into gelato, crowned with burnt honeycomb shards and cacao nib crunch.',
    tags: ['dessert', 'no-cook', 'olive oil'],
    likes: 197
  }
];

const TOP_CREATORS = [
  {
    id: 'ariane-co',
    name: 'Ariane Co.',
    dishes: 48,
    specialty: 'Plant-forward cuisine',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=120&h=120&q=80'
  },
  {
    id: 'atelier-nobu',
    name: 'Atelier Nobu',
    dishes: 61,
    specialty: 'Fermentation & pickling',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&w=120&h=120&q=80'
  },
  {
    id: 'maru-labs',
    name: 'Maru Labs',
    dishes: 37,
    specialty: 'Hyperlocal seafood',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=120&h=120&q=80'
  }
];

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

export function CommunityFeed() {
  const { posts, sharePost, creating, error } = useCommunityFeed();

  const activePosts = posts.length ? posts : COMMUNITY_POSTS;

  const displayPosts = useMemo(
    () =>
      activePosts.map((post) => ({
        ...post,
        creator: post.creator ?? post.author?.name ?? 'Pantry Chef',
        avatar:
          post.avatar ??
          post.author?.avatar ??
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=120&h=120&q=80',
        likes: typeof post.likes === 'number' ? post.likes : 0,
        tags: Array.isArray(post.tags) ? post.tags : []
      })),
    [activePosts]
  );

  const contentDigest = useMemo(
    () =>
      displayPosts.reduce(
        (accumulator, post) => {
          accumulator.likes += post.likes;
          accumulator.tags = [...new Set([...accumulator.tags, ...post.tags])];
          return accumulator;
        },
        { likes: 0, tags: [] }
      ),
    [displayPosts]
  );

  return (
    <div className="space-y-16">
      <section className="glass-panel space-y-10 rounded-3xl p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-brand">
              Community spotlight
            </span>
            <h3 className="text-3xl font-semibold text-ink">Share your favourite plated moments</h3>
            <p className="max-w-2xl text-sm text-ink/70">
              Showcase your latest creation with a photo and story. Every post helps the pantry community cook bolder meals with
              ingredients on hand.
            </p>
          </div>

          <button
            type="button"
            className="pill-button px-6 py-3 text-sm"
            onClick={() =>
              sharePost({
                title: 'Pantry Showcase',
                description: 'Document your signature pantry plate with a quick note and photo.',
                mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
                tags: ['community', 'pantry chef']
              })
            }
            disabled={creating}
          >
            {creating ? 'Sharing…' : 'Share your creation'}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Trending flavours</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {contentDigest.tags.length ? (
                contentDigest.tags.map((tag) => (
                  <span key={tag} className="tag-chip.capitalize">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink/50">
                  Add your first tag by posting!
                </span>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-brand/70">This week&apos;s applause</p>
            <p className="mt-4 text-4xl font-semibold text-ink">{contentDigest.likes.toLocaleString()}</p>
            <p className="text-sm text-ink/60">Total claps & saves from the pantry community.</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-brand/70">Top creators</p>
              <span className="pill-button bg-brand/15 px-4 py-2 text-[11px] font-semibold text-brand">View all</span>
            </div>
            <ul className="space-y-4">
              {TOP_CREATORS.map((creator) => (
                <li key={creator.id} className="flex items-center gap-4 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                  <img className="h-10 w-10 rounded-full object-cover" src={creator.avatar} alt={creator.name} />
                  <div className="flex-1">
                    <p className="text-sm.font-semibold text-ink">{creator.name}</p>
                    <p className="text-xs text-ink/60">{creator.specialty}</p>
                  </div>
                  <span className="rounded-full.bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    {creator.dishes} dishes
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Community table</p>
            <h3 className="text-3xl font-semibold text-ink">What chefs-at-home are plating</h3>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Browse plates shared by food lovers around the globe. Bookmark ideas, leave applause, and remix dishes with what you
              have in your pantry.
            </p>
          </div>
          <button
            type="button"
            className="pill-button px-6 py-3 text-sm"
            onClick={() =>
              sharePost({
                title: 'Story from the Pantry',
                description: 'Share techniques, plating tips, and flavour riffs.',
                mediaUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80',
                tags: ['story', 'pantry']
              })
            }
            disabled={creating}
          >
            {creating ? 'Publishing…' : 'Upload a story'}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {displayPosts.map((post) => (
            <article key={post.id} className="glass-panel flex h-full flex-col gap-5 rounded-3xl p-6">
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img className="h-64 w-full object-cover" src={post.mediaUrl} alt={post.title} />
                <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                  Showcase
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img className="h-10 w-10 rounded-full object-cover" src={post.avatar} alt={post.creator} />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand/70">{post.creator}</p>
                  <h4 className="text-lg font-semibold text-ink">{post.title}</h4>
                </div>
              </div>
              <p className="text-sm text-ink/70">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-chip capitalize">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between text-xs text-ink/60">
                <span>{post.likes.toLocaleString()} applauses</span>
                <button type="button" className="pill-button bg-brand/15 px-4 py-2 text-[11px] font-semibold text-brand">
                  Save plate
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel space-y-10 rounded-3xl p-8" id="learn">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading">Learn to cook</p>
            <h3 className="text-3xl font-semibold text-ink">Step-by-step classes for iconic dishes</h3>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Watch short, focused lessons from restaurant-tested chefs. Practice foundational techniques and elevate your pantry
              creations.
            </p>
          </div>
          <a className="pill-button px-6 py-3 text-sm" href="#" onClick={(event) => event.preventDefault()}>
            Browse full library
          </a>
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
                  <h4 className="mt-1 text-xl font-semibold text-ink">{video.title}</h4>
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
            Keep a notebook for ratios, taste after each tweak, and rehearse mise en place before you press play. Share your class
            recreations in the community feed to inspire others.
          </p>
        </div>
      </section>
    </div>
  );
}
