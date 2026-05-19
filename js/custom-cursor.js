/* =========================================
   SAACHO DHARM — Custom Cursor
   A two-piece cursor (dot + trailing ring)
   in the site's royal saffron + gold palette.
   ========================================= */
(function initCustomCursor() {
    // Only on fine-pointer devices (skip touch / coarse pointers)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Belt-and-braces: skip touch primary devices even if they claim fine pointer
    if ('ontouchstart' in window && navigator.maxTouchPoints > 1) return;

    const HOVER_SEL = [
        'a', 'button', '[role="button"]', 'label',
        '.nav-link', '.hamburger',
        '.hero3__btn', '.h2-btn',
        '.h2-vows__dot', '.h2-yatra-row', '.h2-arch',
        '.bhajan-card', '.h2-vow-slide', '.h2-stat',
        '.tirth-promo-card', '.btn', '.btn-primary',
        '.footer-social a', '.footer-logo'
    ].join(', ');

    const TEXT_SEL = 'input[type="text"], input[type="email"], input[type="search"], input[type="password"], input[type="tel"], input[type="url"], input:not([type]), textarea, [contenteditable="true"]';

    const DISABLED_SEL = 'button[disabled], input[disabled], [aria-disabled="true"]';

    function start() {
        // Create cursor elements
        const dot = document.createElement('div');
        dot.className = 'sd-cursor sd-cursor--dot';
        dot.setAttribute('aria-hidden', 'true');

        const ring = document.createElement('div');
        ring.className = 'sd-cursor sd-cursor--ring';
        ring.setAttribute('aria-hidden', 'true');

        document.body.appendChild(dot);
        document.body.appendChild(ring);
        document.documentElement.classList.add('sd-has-custom-cursor');

        // State
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let visible = false;
        let currentState = '';   // 'hover' | 'text' | 'disabled' | ''
        let rafId = null;

        function setStateFromTarget(target) {
            if (!target || !target.closest) return;

            let next = '';
            if (target.closest(DISABLED_SEL)) {
                next = 'disabled';
            } else if (target.closest(TEXT_SEL)) {
                next = 'text';
            } else if (target.closest(HOVER_SEL)) {
                next = 'hover';
            }

            if (next === currentState) return;

            // Clear old state
            if (currentState) {
                dot.classList.remove('is-' + currentState);
                ring.classList.remove('is-' + currentState);
            }
            // Apply new state
            if (next) {
                dot.classList.add('is-' + next);
                ring.classList.add('is-' + next);
            }
            currentState = next;
        }

        // Track mouse
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!visible) {
                visible = true;
                dot.classList.add('is-visible');
                ring.classList.add('is-visible');
            }

            // Dot follows instantly — write directly for snappiness
            dot.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0)';

            setStateFromTarget(e.target);
        }, { passive: true });

        // Hide when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            visible = false;
            dot.classList.remove('is-visible');
            ring.classList.remove('is-visible');
        });
        document.addEventListener('mouseenter', () => {
            visible = true;
            dot.classList.add('is-visible');
            ring.classList.add('is-visible');
        });

        // Click feedback
        document.addEventListener('mousedown', () => {
            dot.classList.add('is-click');
            ring.classList.add('is-click');
        });
        document.addEventListener('mouseup', () => {
            dot.classList.remove('is-click');
            ring.classList.remove('is-click');
        });

        // Smooth ring lerp via rAF
        function animate() {
            const lerp = 0.2;
            ringX += (mouseX - ringX) * lerp;
            ringY += (mouseY - ringY) * lerp;
            ring.style.transform = 'translate3d(' + ringX.toFixed(1) + 'px, ' + ringY.toFixed(1) + 'px, 0)';
            rafId = requestAnimationFrame(animate);
        }
        animate();

        // Pause when tab is hidden (saves cycles)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            } else if (!document.hidden && !rafId) {
                animate();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
