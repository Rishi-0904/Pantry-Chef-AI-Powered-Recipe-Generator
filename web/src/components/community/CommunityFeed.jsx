import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

const INITIAL_FORM = {
  title: '',
  description: '',
  tags: ''
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function CommunityFeed() {
  const { posts, sharePost, creating, error } = useCommunityFeed();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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

  useEffect(
    () => () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview]
  );

  const handleOpenModal = () => {
    setFormError('');
    setFormValues(INITIAL_FORM);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!creating) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview('');
      setImageFile(null);
      setFormValues(INITIAL_FORM);
      setFormError('');
      setIsModalOpen(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormValues((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError('Please choose an image under 5MB.');
      setImageFile(null);
      setImagePreview('');
      return;
    }

    setFormError('');
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = formValues.title.trim();
    const trimmedDescription = formValues.description.trim();
    if (!trimmedTitle || !trimmedDescription) {
      setFormError('Please provide a title and description.');
      return;
    }

    if (!imageFile) {
      setFormError('Please select an image to upload.');
      return;
    }

    const parsedTags = formValues.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    try {
      await sharePost({
        title: trimmedTitle,
        description: trimmedDescription,
        tags: parsedTags,
        imageFile
      });
      setFormValues(INITIAL_FORM);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview('');
      setImageFile(null);
      setIsModalOpen(false);
      setFormError('');
    } catch (shareError) {
      setFormError(shareError instanceof Error ? shareError.message : 'Could not share your creation. Try again later.');
    }
  };

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
            onClick={handleOpenModal}
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
            onClick={handleOpenModal}
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

      <section className="glass-panel flex flex-col gap-6 rounded-3xl p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="section-heading">Learn something new</p>
          <h3 className="text-3xl font-semibold text-ink">Curated video classes for popular dishes</h3>
          <p className="text-sm text-ink/70">
            Dive into foundational techniques, guided by restaurant mentors. Visit the learning studio to watch step-by-step videos
            and build your flavour skills.
          </p>
        </div>
        <Link className="pill-button px-6 py-3 text-sm" to="/learn">
          Explore the learning studio
        </Link>
      </section>

      <SharePostModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onFileChange={handleFileChange}
        values={formValues}
        imagePreview={imagePreview}
        loading={creating}
        error={formError || error}
      />
    </div>
  );
}

function SharePostModal({ open, onClose, onSubmit, onChange, onFileChange, values, imagePreview, loading, error }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10">
      <div className="glass-panel w-full max-w-xl space-y-6 rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-heading">Share your creation</p>
            <h3 className="text-2xl font-semibold text-ink">Tell the community what you cooked</h3>
          </div>
          <button type="button" className="pill-button bg-brand/15 px-4 py-2 text-[11px] font-semibold text-brand" onClick={onClose}>
            Cancel
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div>
        ) : null}

        <form className="space-y-5" onSubmit={onSubmit} encType="multipart/form-data">
          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Title
            <input
              className="w-full.rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              type="text"
              value={values.title}
              onChange={onChange('title')}
              placeholder="What did you make?"
            />
          </label>

          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Description
            <textarea
              className="h-28 w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              value={values.description}
              onChange={onChange('description')}
              placeholder="Share the story, techniques, or flavours behind your dish."
            />
          </label>

          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Image
            <input
              className="w-full cursor-pointer rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>
          {imagePreview ? (
            <div className="overflow-hidden rounded-2xl border border-white/60">
              <img className="h-48 w-full object-cover" src={imagePreview} alt="Preview of the dish you are sharing" />
            </div>
          ) : (
            <p className="text-xs text-ink/50">Upload a JPG or PNG image up to 5MB.</p>
          )}

          <label className="block space-y-2 text-sm font-semibold text-ink/80">
            Tags
            <input
              className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              type="text"
              value={values.tags}
              onChange={onChange('tags')}
              placeholder="Comma-separated keywords (e.g. brunch, vegetarian, quick)"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              className="pill-button px-6 py-3 text-sm"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Sharing…' : 'Publish to community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
