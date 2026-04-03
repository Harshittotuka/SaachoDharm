/**
 * MAINTENANCE MODE CHECKER
 * Loads config.json and redirects to maintenance.html if maintenance is enabled
 * Set maintenance: true/false in config.json to toggle
 */

(function() {
    'use strict';

    const MAINTENANCE_PAGE = 'maintenance.html';
    const currentPath = (window.location.pathname || '').toLowerCase();
    const isMaintenancePage = currentPath.endsWith('/maintenance.html') || currentPath.endsWith('maintenance.html');
    
    // Load configuration
    fetch('/config.json')
        .then(response => response.json())
        .then(config => {
            // If maintenance mode is on, route all pages to dedicated maintenance page
            if (config.maintenance === true) {
                if (!isMaintenancePage) {
                    window.location.replace(MAINTENANCE_PAGE);
                }
            }
        })
        .catch(() => {
            console.warn('Could not load config.json. Assuming maintenance is OFF.');
            // If config fails to load, assume maintenance is OFF and let site load
        });
})();
