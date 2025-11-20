/**
 * Sitemap Generator for SaachoDharm
 * Generates sitemap.xml from JSON data
 * Usage: Run this on build/deploy or call from server
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://yourdomain.com'; // Change to your domain
const OUTPUT_PATH = path.join(__dirname, '../sitemap.xml');
const DATA_PATH = path.join(__dirname, '../data/jainsaar_full_data.json');

// Base URLs with priority and change frequency
const staticPages = [
  { url: '/index.html', priority: 1.0, changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
  { url: '/bhajans.html', priority: 0.9, changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
  { url: '/tirth-sthal.html', priority: 0.8, changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
  { url: '/gallery.html', priority: 0.7, changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
  { url: '/about.html', priority: 0.8, changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
  { url: '/contact.html', priority: 0.5, changefreq: 'yearly', lastmod: new Date().toISOString().split('T')[0] },
];

function generateSitemapXML(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(item => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${item.url}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

function generateSitemap() {
  try {
    let allUrls = [...staticPages];

    // Try to add dynamic bhajan URLs from JSON
    if (fs.existsSync(DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      
      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach(category => {
          if (category.bhajans && Array.isArray(category.bhajans)) {
            category.bhajans.forEach(bhajan => {
              const slug = bhajan.id || bhajan.title.toLowerCase().replace(/\s+/g, '-');
              allUrls.push({
                url: `/bhajan-lyrics.html?id=${slug}`,
                priority: 0.7,
                changefreq: 'monthly',
                lastmod: new Date().toISOString().split('T')[0],
              });
            });
          }
        });
      }
    }

    const sitemapXML = generateSitemapXML(allUrls);
    fs.writeFileSync(OUTPUT_PATH, sitemapXML, 'utf8');
    console.log(`✅ Sitemap generated: ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${allUrls.length}`);
    return true;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return false;
  }
}

// Export for use in other scripts
module.exports = { generateSitemap };

// Run if executed directly
if (require.main === module) {
  generateSitemap();
}
