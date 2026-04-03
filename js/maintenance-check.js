/**
 * MAINTENANCE MODE CHECKER
 * Loads config.json and blocks access to all pages if maintenance is enabled
 * Set maintenance: true/false in config.json to toggle
 */

(function() {
    'use strict';
    
    // Load configuration
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            // If maintenance mode is on, show maintenance page
            if (config.maintenance === true) {
                showMaintenancePage(config.maintenance_message || 'Under Maintenance');
            }
        })
        .catch(error => {
            console.warn('Could not load config.json. Assuming maintenance is OFF.');
            // If config fails to load, assume maintenance is OFF and let site load
        });

    function showMaintenancePage(message) {
        // Create and inject maintenance overlay
        const overlay = document.createElement('div');
        overlay.id = 'maintenance-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: 'Merriweather', serif;
        `;

        // Create container
        const container = document.createElement('div');
        container.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 60px 40px;
            max-width: 600px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.6s ease-in;
        `;

        container.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px; animation: pulse 2s infinite;">🙏</div>
            <h1 style="color: #1a472a; font-size: 36px; margin-bottom: 15px; font-weight: 700;">Under Maintenance</h1>
            <p style="color: #666; font-size: 18px; margin-bottom: 30px; line-height: 1.6;">SaachoDharm is currently undergoing improvements</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #1a472a; border-radius: 4px; margin: 30px 0; text-align: left; line-height: 1.8;">
                <strong style="color: #1a472a;">What's happening?</strong>
                <p style="margin-top: 10px; color: #666;">${message}</p>
            </div>

            <div style="display: flex; justify-content: center; gap: 40px; margin: 30px 0; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Expected Return</div>
                    <div style="color: #1a472a; font-size: 20px; font-weight: 600;">Soon</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Status</div>
                    <div style="color: #1a472a; font-size: 20px; font-weight: 600;">🔧 In Progress</div>
                </div>
            </div>

            <div style="width: 100%; height: 3px; background: #eee; border-radius: 3px; margin-top: 30px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%); width: 30%; animation: loading 1.5s ease-in-out infinite;"></div>
            </div>

            <div style="margin: 40px 0; padding: 20px; background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); border-radius: 8px; color: white;">
                <h3 style="margin-bottom: 15px; font-size: 16px;">Thank you for your patience</h3>
                <p style="font-size: 14px; line-height: 1.6;">We appreciate your understanding as we work to serve you better.</p>
            </div>

            <div style="margin-top: 40px; color: #999; font-size: 12px;">
                © 2026 SaachoDharm • Jain Spiritual Knowledge Platform
            </div>
        `;

        overlay.appendChild(container);

        // Add styles for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @keyframes loading {
                0% { width: 10%; }
                50% { width: 70%; }
                100% { width: 90%; }
            }
        `;
        document.head.appendChild(style);

        // Inject overlay
        document.body.appendChild(overlay);

        // Prevent all interactions
        document.body.style.overflow = 'hidden';
        
        // Block all links and forms
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }
})();
