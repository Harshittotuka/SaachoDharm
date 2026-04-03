/**
 * CLIENT-SIDE ROUTER
 * Handles pretty URLs like /bhajan/hanuman-chalisa -> loads jain-bhajan-lyrics.html
 * Falls back when .htaccess isn't available
 */

(function() {
    'use strict';
    
    // Skip routing if we're already on the actual HTML files
    const currentFile = window.location.pathname.split('/').pop();
    if (currentFile && currentFile.includes('.html')) {
        return; // Already on an actual HTML file
    }
    
    const path = window.location.pathname;
    
    // Pattern: /bhajan/something
    const bhajanMatch = path.match(/^\/bhajan\/([^/]+)(?:\/)?$/i);
    if (bhajanMatch) {
        const slug = decodeURIComponent(bhajanMatch[1]);
        // Redirect to the actual page with query parameter
        const newUrl = '/jain-bhajan-lyrics.html?bhajan_slug=' + encodeURIComponent(slug);
        window.location.replace(newUrl);
        return;
    }
    
    // Pattern: /tirth/something
    const tirthMatch = path.match(/^\/tirth\/([^/]+)(?:\/)?$/i);
    if (tirthMatch) {
        const id = decodeURIComponent(tirthMatch[1]);
        // Redirect to the actual page with query parameter
        const newUrl = '/tirth-sthal-detail.html?tirth_id=' + encodeURIComponent(id);
        window.location.replace(newUrl);
        return;
    }
    
    // Pattern: /bhajans (without .html)
    if (path === '/bhajans' || path === '/bhajans/') {
        window.location.replace('/bhajans.html');
        return;
    }
    
    // Pattern: /about (without .html)
    if (path === '/about' || path === '/about/') {
        window.location.replace('/about.html');
        return;
    }
    
    // Pattern: /calendar (without .html)
    if (path === '/calendar' || path === '/calendar/') {
        window.location.replace('/calendar.html');
        return;
    }
    
    // Pattern: /contact (without .html)
    if (path === '/contact' || path === '/contact/') {
        window.location.replace('/contact.html');
        return;
    }
    
    // Pattern: /jain-bhajan-lyrics (without .html)
    if (path === '/jain-bhajan-lyrics' || path === '/jain-bhajan-lyrics/') {
        window.location.replace('/jain-bhajan-lyrics.html');
        return;
    }
    
    // Pattern: /tirth-sthal (without .html)
    if (path === '/tirth-sthal' || path === '/tirth-sthal/') {
        window.location.replace('/tirth-sthal.html');
        return;
    }
    
})();
