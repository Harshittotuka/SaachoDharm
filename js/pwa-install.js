/* =========================================
   PWA Install Prompt — SaachoDharm
   Shows install banner on mobile devices
   when the app is installable.
   ========================================= */

(function () {
    'use strict';

    // ---- Register Service Worker ----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered:', reg.scope))
                .catch(err => console.warn('SW registration failed:', err));
        });
    }

    // ---- Elements ----
    let deferredPrompt = null;
    const bar       = document.getElementById('pwaInstallBar');
    const installBtn = document.getElementById('pwaInstallBtn');
    const dismissBtn = document.getElementById('pwaDismissBtn');

    // ---- Helper: move fab-hub up/down when bar shows/hides ----
    function updateHubPosition(barVisible) {
        const hub = document.getElementById('fabHub');
        if (!hub) return;
        if (barVisible) {
            hub.classList.add('bar-visible');
        } else {
            hub.classList.remove('bar-visible');
        }
    }

    // ---- Show / Hide helpers ----
    function showBar() {
        if (!bar) return;
        bar.classList.add('visible');
        updateHubPosition(true);
    }

    function hideBar() {
        if (!bar) return;
        bar.classList.remove('visible');
        updateHubPosition(false);
    }

    // ---- Capture beforeinstallprompt (Chrome / Edge / Samsung) ----
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredPrompt = e;
        showBar();
    });

    // ---- Trigger native install ----
    async function triggerInstall() {
        if (!deferredPrompt) {
            showIOSInstructions();
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install outcome:', outcome);
        deferredPrompt = null;
        hideBar();
    }

    // ---- Install button click (banner button) ----
    if (installBtn) {
        installBtn.addEventListener('click', triggerInstall);
    }

    // ---- Dismiss button — hide bar (user can reopen via hub) ----
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            hideBar();
        });
    }

    // ---- Listen for hub install button click ----
    window.addEventListener('fab-install-click', () => {
        if (deferredPrompt) {
            showBar();
        } else {
            triggerInstall();
        }
    });

    // ---- App was installed — hide everything ----
    window.addEventListener('appinstalled', () => {
        hideBar();
        deferredPrompt = null;
    });

    // ---- Already running as installed app — do nothing ----
    function isInStandaloneMode() {
        return ('standalone' in navigator && navigator.standalone) ||
               window.matchMedia('(display-mode: standalone)').matches;
    }

    if (isInStandaloneMode()) {
        // Already installed, don't show anything
        return;
    }

    // ---- iOS Safari Fallback ----
    function isIOS() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    }

    if (isIOS() && !isInStandaloneMode()) {
        showBar();
        if (installBtn) {
            installBtn.innerHTML = '<i class="fas fa-plus-square"></i> Add to Home';
        }
    }

    function showIOSInstructions() {
        const overlay = document.createElement('div');
        overlay.className = 'pwa-ios-overlay';
        overlay.innerHTML = `
            <div class="pwa-ios-modal">
                <h3>Install Jain Panchang</h3>
                <p>To add this app to your home screen:</p>
                <ol>
                    <li>Tap the <strong>Share</strong> button <i class="fas fa-share-square" style="color:var(--accent-saffron)"></i> at the bottom of Safari</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>Add</strong></li>
                </ol>
                <button class="pwa-ios-close" id="iosCloseBtn">Got it</button>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('visible'));

        overlay.querySelector('#iosCloseBtn').addEventListener('click', () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        });
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }

})();
