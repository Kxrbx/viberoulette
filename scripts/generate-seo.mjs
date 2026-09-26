// Generates static SEO pages (no dependency) after `vite build`.
// Reads src/data/*.ts, writes dist/ideas/, dist/niches/*/, dist/products/*/
// and a full dist/sitemap.xml. Ponytail: stdlib only, relative links so the
// './' base (github pages + custom domain) keeps working.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://viberoulette.lol'

function readList(file, name) {
  const src = readFileSync(join(root, 'src', 'data', file), 'utf8')
  const body = src.slice(src.indexOf('['), src.lastIndexOf(']'))
  const out = []
  for (const m of body.matchAll(/"([^"]*)"|'([^']*)'/g)) out.push(m[1] ?? m[2])
  if (!out.length) throw new Error(`no items parsed from ${name}`)
  return out
}

function slugify(s) {
  const base = s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'idea'
}

function uniqueSlugs(items) {
  const seen = new Map()
  return items.map((item) => {
    const base = slugify(item)
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    return n === 0 ? base : `${base}-${n + 1}`
  })
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function sentence(product, niche) {
  const s = `${product} for ${niche}.`
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const CSS =
  'body{background:#0a0a0a;color:#ededed;font-family:system-ui,sans-serif;margin:0;line-height:1.6}' +
  'main{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 4rem}' +
  'a{color:#ededed}h1{font-size:clamp(1.6rem,4vw,2.4rem);letter-spacing:-.01em}' +
  '.dim{color:#9a9a9a}ol{padding-left:1.25rem}li{margin:.4rem 0}' +
  '.cta{display:inline-block;border:1px solid #3d3d3d;border-radius:999px;padding:.7rem 2rem;text-decoration:none;margin-top:1.5rem}' +
  'nav.tags a{display:inline-block;margin:.2rem .4rem .2rem 0;color:#9a9a9a}' +
  'footer{margin-top:2.5rem;border-top:1px solid #242424;padding-top:1rem}'

const TODAY_LABEL = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
const AUTHOR = '<a href="https://x.com/kxrbx" rel="noopener">Kxrbx</a>'

function page({ title, desc, canonical, h1, body, breadcrumb, extra = [], home = '../' }) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: title, url: canonical, description: desc },
      ...(breadcrumb
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumb.map((b, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: b.name,
                item: b.url,
              })),
            },
          ]
        : []),
      ...extra,
    ],
  }
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${SITE}/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>${CSS}</style>
</head>
<body>
<main>
<h1>${esc(h1)}</h1>
${body}
<footer><p class="dim">Updated ${TODAY_LABEL} · Built by ${AUTHOR} · <a href="${home}">Vibe Roulette — spin the wheel</a></p></footer>
</main>
</body>
</html>
`
}

function write(rel, html) {
  const file = join(dist, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const NICHES = readList('niches.ts', 'niches')
const PRODUCTS = readList('products.ts', 'products')
const nicheSlugs = uniqueSlugs(NICHES)
const productSlugs = uniqueSlugs(PRODUCTS)
// ponytail: deterministic spread, no RNG in build output
const pick = (arr, i, step) => arr[(i * step) % arr.length]

const urls = [`${SITE}/`, `${SITE}/ideas/`]

// --- ideas index ---
{
  const total = (NICHES.length * PRODUCTS.length).toLocaleString('en-US')
  const nicheLinks = NICHES.map((n, i) => `<li><a href="../niches/${nicheSlugs[i]}/">${esc(n)} ideas</a></li>`).join('')
  const productLinks = PRODUCTS.map((p, i) => `<li><a href="../products/${productSlugs[i]}/">${esc(sentence(p, 'your niche').slice(0, -1))}s</a></li>`).join('')
  const faq = [
    ['What is Vibe Roulette?', 'A one-button idea generator for vibe coders. Click once and get a niche plus a product type to build — specific enough to start tonight.'],
    [`How many ideas are there?`, `${NICHES.length} niches × ${PRODUCTS.length} product types = ${total} unique combinations, plus optional twists. Draws come from a shuffle bag, so repeats are rare.`],
    ['Is it free? Do I need an account?', 'Free forever, no login, no ads, no email capture. One page, one action.'],
    ['Who is it for?', 'Vibe coders: people who ship software with AI assistance and stall on "what should I build next?".'],
  ]
  const faqHtml = faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')
  write(
    'ideas/index.html',
    page({
      title: 'Startup ideas by niche and product — Vibe Roulette',
      desc: `Browse ${total} startup ideas: every niche and product type on the Vibe Roulette wheel, with concrete examples to build this weekend.`,
      canonical: `${SITE}/ideas/`,
      h1: 'Startup ideas by niche',
      breadcrumb: [{ name: 'Home', url: `${SITE}/` }],
      home: '../',
      extra: [
        {
          '@type': 'FAQPage',
          mainEntity: faq.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        },
      ],
      body: `<p class="dim">Vibe Roulette combines ${NICHES.length} niches with ${PRODUCTS.length} product types — over ${total} ideas. Pick a lane, get inspired, then <a href="../">spin the wheel</a>.</p>
<h2>By niche</h2><ol>${nicheLinks}</ol>
<h2>By product type</h2><ol>${productLinks}</ol>
<h2>FAQ</h2>${faqHtml}
<a class="cta" href="../">Spin the wheel</a>`,
    }),
  )
}

// --- niche pages ---
NICHES.forEach((niche, i) => {
  const slug = nicheSlugs[i]
  const examples = Array.from({ length: 12 }, (_, k) => sentence(pick(PRODUCTS, i + k * 7, 1), niche))
  const related = Array.from({ length: 6 }, (_, k) => {
    const j = (i + 1 + k) % NICHES.length
    return `<a href="../${nicheSlugs[j]}/">${esc(NICHES[j])}</a>`
  }).join(' ')
  const url = `${SITE}/niches/${slug}/`
  urls.push(url)
  write(
    `niches/${slug}/index.html`,
    page({
      title: `Startup ideas for ${niche} — Vibe Roulette`,
      desc: `Concrete startup ideas for ${niche}: ${examples.slice(0, 3).join(' ').slice(0, 140)}…`,
      canonical: url,
      h1: `Startup ideas for ${niche}`,
      breadcrumb: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Ideas', url: `${SITE}/ideas/` },
      ],
      home: '../../',
      body: `<p class="dim">Software startup ideas <em>for builders</em> targeting ${esc(niche)} — concrete products a vibe coder can ship in a weekend. Not a how-to-start-a-${esc(niche)}-business guide.</p>
<ol>${examples.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>
<nav class="tags"><span class="dim">Related niches:</span> ${related}</nav>
<a class="cta" href="../../">Spin the wheel for ${esc(niche)}</a>`,
    }),
  )
})

// --- product pages ---
PRODUCTS.forEach((product, i) => {
  const slug = productSlugs[i]
  const cap = product.charAt(0).toUpperCase() + product.slice(1)
  const examples = Array.from({ length: 12 }, (_, k) => sentence(product, pick(NICHES, i + k * 11, 1)))
  const url = `${SITE}/products/${slug}/`
  urls.push(url)
  write(
    `products/${slug}/index.html`,
    page({
      title: `${cap} — startup ideas for real niches — Vibe Roulette`,
      desc: `${cap} ideas for real niches: ${examples.slice(0, 3).join(' ').slice(0, 140)}…`,
      canonical: url,
      h1: `${cap} — startup ideas`,
      breadcrumb: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Ideas', url: `${SITE}/ideas/` },
      ],
      home: '../../',
      body: `<p class="dim">One product shape, ${NICHES.length} niches — concrete software ideas for builders. Pick the audience and start building tonight.</p>
<ol>${examples.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>
<a class="cta" href="../../">Spin the wheel</a>`,
    }),
  )
})

// --- full sitemap + SPA fallback ---
const TODAY = new Date().toISOString().slice(0, 10)
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq></url>`).join('\n')}\n</urlset>\n`,
)
// Static hosts serve 404.html for unknown routes: reload the app instead of a dead end.
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))

console.log(`seo: ${NICHES.length} niches, ${PRODUCTS.length} products, ${urls.length} urls`)
