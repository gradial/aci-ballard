import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error('Usage: npx tsx scripts/import-ballard-source.mjs /path/to/ballard');

const seed = await import(pathToFileURL(path.join(sourceRoot, 'contentful/seed-data/products.ts')).href);
const { products, categoryMeta, categoryPath } = seed;
const { stories } = await import(pathToFileURL(path.join(sourceRoot, 'contentful/seed-data/stories.ts')).href);
const nav = await import(pathToFileURL(path.join(sourceRoot, 'contentful/seed-data/nav.ts')).href);
const outputRoot = path.resolve('.content/pages');
const badgeLabels = { new: 'New', 'best-seller': 'Best seller', limited: 'Limited run' };
const imagePath = (ref) => `/assets/ballard/images/photo-${ref.key}-${ref.i ?? 0}.webp`;
// The source app reads the live Contentful collection order, which is intentionally
// different from the seed-file declaration order. Preserve the deployed related-card
// sequence (including same-name colour variants such as the two Cascade cards).
const liveRelated = new Map();
await Promise.all(products.map(async (product) => {
  try {
    const html = await (await fetch(`https://ballard-five.vercel.app/products/${product.slug}`)).text();
    const section = html.slice(html.indexOf('Goes with it'));
    const slugs = [...section.matchAll(/href="\/products\/([^"?]+)/g)].map((match) => match[1]);
    const unique = [...new Set(slugs)].slice(0, 4);
    if (unique.length) liveRelated.set(product.slug, unique);
  } catch { /* fall back to the checked-in source algorithm below */ }
}));
const writePage = async (route, page) => {
  const directory = path.join(outputRoot, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, '_index.json'), `${JSON.stringify(page, null, 2)}\n`);
};
const idFor = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const card = (product) => ({
  id: product.slug,
  image: imagePath(product.image),
  imageAlt: `${product.name} in ${product.colorways[0]?.name ?? 'featured color'}`,
  ...(product.badges?.[0] ? { badge: badgeLabels[product.badges[0]] } : {}),
  title: product.name,
  href: `/products/${product.slug}`,
  description: product.summary,
  price: `$${product.price.toLocaleString('en-US')}`,
  colors: product.colorways.map((color) => color.hex),
  category: product.sub,
  conditions: product.conditions,
  materials: product.materials,
  sizes: product.sizes,
});

for (const category of ['mens', 'womens', 'kids', 'packs-gear', 'field', 'new', 'best-sellers']) {
  const meta = categoryMeta[category];
  const items = category === 'new'
    ? products.filter((product) => product.badges?.includes('new'))
    : category === 'best-sellers'
      ? products.filter((product) => product.badges?.includes('best-seller'))
      : products.filter((product) => product.category === category);
  // The Delivery API query in the source app orders its catalog by fields.name.
  // Keep that deployed order instead of the seed module's authoring order.
  items.sort((left, right) => left.name.localeCompare(right.name));
  await writePage(`shop/${category}`, {
    $type: 'page', id: `shop-${category}`, status: 'published', layout: 'default',
    metadata: { title: `${meta.title} | Ballard`, description: meta.blurb },
    regions: { main: [{
      id: 'listing', component: 'product_listing', props: {
        breadcrumb: [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/mens' }, { label: meta.title, href: `/shop/${category}` }],
        heading: meta.title, description: meta.blurb,
        categories: meta.subs.length ? [{ label: 'All', key: '' }, ...meta.subs.map((sub) => ({ label: sub.label, key: sub.key }))] : [],
        products: items.map(card),
      },
    }] },
  });
}

for (const product of products) {
  const meta = categoryMeta[product.category];
  const subLabel = meta.subs.find((sub) => sub.key === product.sub)?.label;
  const fallbackRelated = products
    .filter((candidate) => candidate.slug !== product.slug && (candidate.category === product.category || candidate.sub === product.sub))
    .slice(0, 4);
  const related = liveRelated.has(product.slug)
    ? liveRelated.get(product.slug).map((slug) => products.find((candidate) => candidate.slug === slug)).filter(Boolean)
    : fallbackRelated;
  const galleryRefs = [product.image, ...(product.gallery ?? [])].slice(0, 4);
  await writePage(`products/${product.slug}`, {
    $type: 'page', id: `product-${product.slug}`, status: 'published', layout: 'default',
    metadata: { title: product.seo.title, description: product.seo.description },
    regions: { main: [{
      id: 'product', component: 'product_detail', props: {
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: meta.title, href: categoryPath[product.category] },
          ...(subLabel ? [{ label: subLabel, href: `${categoryPath[product.category]}?sub=${product.sub}` }] : []),
          { label: product.name, href: `/products/${product.slug}` },
        ],
        name: product.name, tagline: product.summary, price: `$${product.price.toLocaleString('en-US')}`,
        colorName: product.colorways[0]?.name ?? '', colors: product.colorways.map((color) => color.hex), colorOptions: product.colorways.map((color) => ({ name: color.name, hex: color.hex })), sizes: product.sizes,
        ...(product.made ? { made: product.made } : {}),
        gallery: galleryRefs.map((ref, index) => ({
          image: imagePath(ref), alt: product.name,
          ...(index === 0 && product.colorways[0] ? { caption: product.colorways[0].name } : {}),
          ...(index === 1 ? { caption: "Model is 5'11\", wearing a size M" } : {}),
        })),
        delivery: [
          { label: 'Delivery', value: 'Free shipping over $99. Ships in 1 to 2 business days.' },
          { label: 'Store pickup', value: 'Ballard Fremont, usually same day.' },
          { label: 'Returns', value: '60 days, worn or not. Repair is free for life.' },
        ],
        paragraphs: product.body, tradeoff: product.tradeoff, fit: product.fitNote ?? '', care: product.care,
        repairEligible: product.repairEligible, specs: product.specs, related: related.map(card),
      },
    }] },
  });
}

const storyCard = (story) => ({
  id: story.slug, image: imagePath(story.image), imageAlt: story.title, title: story.title,
  description: story.dek, readTime: `${story.readMinutes} min read`, href: `/stories/${story.slug}`,
});
for (const story of stories) {
  const more = stories.filter((candidate) => candidate.slug !== story.slug).slice(0, 3);
  const date = new Date(`${story.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  await writePage(`stories/${story.slug}`, {
    $type: 'page', id: `story-${story.slug}`, status: 'published', layout: 'default',
    metadata: { title: `${story.title} | Ballard`, description: story.dek },
    regions: { main: [{ id: 'article', component: 'story_detail', props: {
      kind: story.kind, title: story.title, description: story.dek, author: story.author, date,
      readTime: `${story.readMinutes} min read`, image: imagePath(story.image), imageAlt: story.title,
      paragraphs: story.body, more: more.map(storyCard),
    } }] },
  });
}

await writeFile(path.resolve('.content/fragments/navbar/_index.json'), `${JSON.stringify({
  $type: 'fragment', fragmentId: 'navbar', component: 'site_navigation', props: {
    brandHref: '/', brandLabel: 'Ballard', brandLogo: '/assets/ballard/images/ballard-logo-black-transparent.svg',
    utilityLinks: nav.utilityLinks.map((link) => ({ id: idFor(link.label), ...link })),
    promo: { id: 'promo', ...nav.announcements[0] },
    announcements: nav.announcements.map((link) => ({ id: idFor(link.label), ...link })),
    navigation: nav.mainNav.map((item) => ({
      id: idFor(item.label), label: item.label, href: item.href,
      ...(item.columns ? { columns: item.columns } : {}),
      ...(item.tile ? { tile: { ...item.tile, image: imagePath(item.tile.image), imageAlt: item.tile.title } } : {}),
    })),
  },
}, null, 2)}\n`);

console.log(`Imported ${products.length} products, ${stories.length} stories, 7 catalog routes, and source navigation from ${sourceRoot}`);
