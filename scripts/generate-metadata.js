const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const PUBLIC_API_DIR = path.join(process.cwd(), 'public', 'api');
const CATEGORIES = ['longevity', 'beslenme', 'saglik', 'neuroperformance'];

function getGitSha(content) {
  const header = `blob ${Buffer.byteLength(content)}\0`;
  const store = Buffer.concat([Buffer.from(header), Buffer.from(content)]);
  return crypto.createHash('sha1').update(store).digest('hex');
}

function generateMetadata() {
  console.log('Generating articles metadata for admin panel...');
  const metadata = [];

  for (const cat of CATEGORIES) {
    const dir = path.join(ARTICLES_DIR, cat);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(dir, file);
      
      try {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const sha = getGitSha(rawContent);
        const { data } = matter(rawContent);
        
        metadata.push({
          slug,
          category: cat,
          sha,
          title: data.title ?? '',
          altBaslik1: data.altBaslik1 ?? '',
          date: data.date 
            ? (typeof data.date === 'string' ? data.date.slice(0, 10) : new Date(data.date).toISOString().slice(0, 10))
            : '',
          status: data.status ?? 'published'
        });
      } catch (err) {
        console.error(`Error processing metadata for ${cat}/${slug}:`, err);
      }
    }
  }

  if (!fs.existsSync(PUBLIC_API_DIR)) {
    fs.mkdirSync(PUBLIC_API_DIR, { recursive: true });
  }

  fs.writeFileSync(
    path.join(PUBLIC_API_DIR, 'articles-metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );
  console.log(`Generated metadata for ${metadata.length} articles successfully.`);
}

generateMetadata();
