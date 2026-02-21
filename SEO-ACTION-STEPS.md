# SaachoDharm — SEO Action Steps (Manual To-Do)

Everything below requires **your action** — these are things that can't be automated in code alone.

---

## ✅ Already Done (by code changes)

- [x] Fixed canonical tags on all 6 pages (proper `<link rel="canonical">`)
- [x] Replaced all `yourdomain.com` placeholders with `www.saachodharm.com`
- [x] Added `meta robots` tag to all pages
- [x] Fixed OG images and Twitter images to use actual `img/icon.jpeg`
- [x] Added `og:locale` to all pages
- [x] Added `twitter:image` to all pages that were missing it
- [x] Fixed JSON-LD schemas (correct domain, removed fake data)
- [x] Added Calendar page to all SEO files (sitemap, seo-manager, breadcrumbs)
- [x] Fixed `robots.txt` (removed contradictions, fixed domain consistency)
- [x] Generated fresh `sitemap.xml` with all 342 URLs (6 static + 336 bhajans)
- [x] Added Calendar and Bhajan Lyrics handlers in `seo-manager.js`
- [x] Fixed BreadcrumbList schema (added About + Calendar, removed duplicate)

---

## 🔴 HIGH PRIORITY — Do These First

### 1. Submit Sitemap to Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your site: `https://www.saachodharm.com`
3. Verify ownership (HTML file upload or DNS record)
4. Go to **Sitemaps** → Enter `sitemap.xml` → Click **Submit**
5. Wait for Google to crawl (can take 1-7 days)

### 2. Submit Sitemap to Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site and verify ownership
3. Submit `https://www.saachodharm.com/sitemap.xml`

### 3. Set Up www vs non-www Redirect
Your site should only be accessible at ONE version. Pick `www.saachodharm.com`.
- In your hosting panel (Netlify/Vercel/cPanel), set up a **301 redirect** from `saachodharm.com` → `www.saachodharm.com`
- This prevents duplicate content issues

### 4. Create a Proper OG Image (1200x630px)
Currently using `icon.jpeg` as the social share image. For better social media presence:
1. Create a **1200x630px** image with your logo + site name + tagline
2. Save as `img/og-image.jpg` (JPEG, under 1MB)
3. Update the `og:image` and `twitter:image` URLs in all HTML files to point to it

### 5. Set Up HTTPS (if not already)
- Ensure your site loads on `https://` (not `http://`)
- Most hosts (Netlify, Vercel, GitHub Pages) provide free SSL
- HTTPS is a Google ranking signal

---

## 🟡 MEDIUM PRIORITY — Do Within a Week

### 6. Add Your Real Contact Information
In `contact.html`, the current contact details are placeholder data (123 Dharma Path, 555-123-4567, info@jaindharma.org). Replace with:
- Your real email address
- Your real location/city (or remove address if you prefer)
- Your real social media links

### 7. ~~Set Up Google Analytics~~ ✅ DONE
GA4 tag `G-JZ4D7HKKBX` added to all 6 HTML pages.

### 8. Register on Google Business Profile (Optional)
If SaachoDharm has a physical location or is a recognized organization:
1. Go to [Google Business Profile](https://business.google.com/)
2. Register your organization
3. This helps with Knowledge Panel and local SEO

### 9. Add Alt Text to All Images
- Any images on the site should have descriptive `alt` attributes
- Example: `alt="Jain temple at Ranakpur"` instead of `alt="image"`
- The `seo-manager.js` auto-adds basic alt text, but manual ones are better

### 10. Create Social Media Profiles
Add links to real social media accounts. Currently the JSON-LD references:
- `facebook.com/saachodharm`
- `instagram.com/saachodharm`
- `youtube.com/saachodharm`

If these don't exist, either create them or remove the `sameAs` links from `index.html`.

---

## 🟢 LOW PRIORITY — Nice to Have

### 11. Add More Content Pages
Google rewards sites with more quality content. Consider adding:
- Individual pages for important festivals (Paryushana, Mahavir Jayanti)
- Blog posts about Jain philosophy
- Tirth Sthal (pilgrimage sites) page with images

### 12. Improve Page Load Speed
- Compress images using [TinyPNG](https://tinypng.com/)
- Consider adding `loading="lazy"` to images below the fold
- Minify CSS/JS for production

### 13. Build Backlinks
Get other Jain community websites to link to yours:
- Jain temple websites
- Jain organization directories
- Community forums and groups

### 14. Add hreflang Tags (If Adding Hindi Content)
If you plan to add Hindi-language pages alongside English:
```html
<link rel="alternate" hreflang="en" href="https://www.saachodharm.com/about.html">
<link rel="alternate" hreflang="hi" href="https://www.saachodharm.com/hi/about.html">
```

### 15. Monitor & Maintain
- Check Google Search Console weekly for errors
- Re-run `py generate_sitemap.py` after adding new bhajans
- Update `lastmod` dates when pages are changed
- Monitor Core Web Vitals in Search Console

---

## Quick Commands

| Task | Command |
|------|---------|
| Regenerate sitemap after adding bhajans | `py generate_sitemap.py` |
| Generate sitemap via Node.js | `npm run generate-sitemap` |
| Start local dev server | `npm run dev` |

---

*Last updated: February 2026*
