const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const SUBTOPIC_MAP = {
  'Vitamin ve Mineral': 'Vitaminler & Mineraller',
  'Kardiyovasküler': 'Kardiyovasküler Sağlık',
  'Diyabet & İnsülin Direnci': 'Hormonlar & Metabolizma',
  'Tiroid Hastalıkları': 'Hormonlar & Metabolizma',
  'Hormonlar & Endokrin': 'Hormonlar & Metabolizma',
  'Antioksidanlar': 'Hücresel Sağlık & Anti-Aging',
  'Doğal Antiaging': 'Hücresel Sağlık & Anti-Aging',
  'Yaşlılık & Kronik Hast.': 'Hücresel Sağlık & Anti-Aging',
  'İSG & Güvenlik': 'İSG & Risk Yönetimi',
  'İş Kazaları': 'İSG & Risk Yönetimi',
  'Risk & KKD': 'İSG & Risk Yönetimi',
  'Acil Durum & İlk Yardım': 'Acil Durum & Yangın',
  'Yangın Güvenliği': 'Acil Durum & Yangın',
  'Kurumsal Sağlık': 'Kurumsal Sağlık & Protokoller',
  'Kurumsal Protokoller': 'Kurumsal Sağlık & Protokoller',
  'Bilişsel Performans': 'Nöroloji & Bilişsel Performans',
  'Nöroloji & Beyin': 'Nöroloji & Bilişsel Performans',
  'Psikoloji & Ruh Sağlığı': 'Ruh Sağlığı & Stres',
  'Tükenmişlik & Stres': 'Ruh Sağlığı & Stres',
  'Uyku & Vardiyalı Çalışma': 'Uyku & Biyolojik Ritim',
  'Fiziksel Performans': 'Performans & Egzersiz',
  'Egzersiz & Fiziksel Aktivite': 'Performans & Egzersiz',
};

function normalizeSubtopic(topic) {
  if (!topic) return '';
  return SUBTOPIC_MAP[topic] || topic;
}

function getArticleSlugs(category) {
  const dir = path.join(ARTICLES_DIR, category);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}

function getArticleBySlug(category, slug) {
  const filePath = path.join(ARTICLES_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  return {
    slug,
    title: data.title ?? '',
    category: category,
    altBaslik1: normalizeSubtopic(data.altBaslik1),
    altBaslik2: data.altBaslik2 ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    image: data.image ?? '',
  };
}

function getAllArticles() {
  const categories = ['longevity', 'beslenme', 'saglik', 'neuroperformance'];
  return categories
    .flatMap(cat => {
      const slugs = getArticleSlugs(cat);
      return slugs
        .map(slug => getArticleBySlug(cat, slug))
        .filter(a => a !== null);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateRss() {
  console.log('Generating RSS feed...');
  const articles = getAllArticles();
  const siteUrl = 'https://drmustafakebat.com';

  const rssItems = articles
    .map((article) => {
      const pubDate = new Date(article.date).toUTCString();
      const articleLink = `${siteUrl}/${article.category}/${article.slug}/`; // uses trailingSlash: true format
      const escapedTitle = escapeXml(article.title);
      const escapedExcerpt = escapeXml(article.excerpt || '');

      return `
    <item>
      <title>${escapedTitle}</title>
      <link>${articleLink}</link>
      <description>${escapedExcerpt}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${articleLink}</guid>
      ${article.image ? `<enclosure url="${siteUrl}${article.image.startsWith('/') ? '' : '/'}${article.image}" length="0" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr. Mustafa Kebat</title>
    <link>${siteUrl}</link>
    <description>Longevity, kurumsal sağlık sistemleri ve nöroergonomi alanlarında uzman hekim ve iş güvenliği danışmanı.</description>
    <language>tr</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), rss, 'utf8');
  console.log('RSS feed generated successfully at public/feed.xml');
}

generateRss();
