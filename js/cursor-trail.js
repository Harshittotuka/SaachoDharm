/* =========================================
   SAACHO DHARM — Mouse Trail (canvas)
   Jain symbols + Sanskrit syllables that drift
   and fade behind the cursor. Single canvas + rAF
   for smooth 60fps with no DOM thrash.
   ========================================= */
(function initJainTrail() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window && navigator.maxTouchPoints > 1) return;

    const SYMBOLS = [
        'ॐ', '☸', '✦', '◆', '卐',
        'णमो', 'अर्हं', 'सिद्ध', 'आचार्य', 'साधु',
        'अहिंसा', 'सत्य', 'अस्तेय', 'ब्रह्म',
        'दर्शन', 'ज्ञान', 'चारित्र',
        'धर्म', 'मोक्ष', 'आत्मा', 'जिन', 'जैन',
        'ण', 'मो', 'अ', 'सि', 'जि'
    ];

    const COLORS = [
        '#ff6b35',
        '#ffd700',
        '#e8a23d',
        '#c9852b',
        '#ffb347'
    ];

    const MAX_PARTICLES = 26;
    const SPAWN_INTERVAL = 60;
    const LIFETIME = 1200;
    const MIN_MOVE_SQ = 36;

    let canvas, ctx;
    let dpr = 1;
    let cssW = 0, cssH = 0;
    let lastSpawn = 0;
    let lastX = -999, lastY = -999;
    let running = true;
    const particles = [];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        cssW = window.innerWidth;
        cssH = window.innerHeight;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e) {
        const x = e.clientX;
        const y = e.clientY;
        const now = performance.now();
        if (now - lastSpawn < SPAWN_INTERVAL) return;
        const dx = x - lastX;
        const dy = y - lastY;
        if (dx * dx + dy * dy < MIN_MOVE_SQ) return;
        lastSpawn = now;
        lastX = x;
        lastY = y;

        if (particles.length >= MAX_PARTICLES) particles.shift();

        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 18,
            vy: -22 - Math.random() * 30,
            char: SYMBOLS[(Math.random() * SYMBOLS.length) | 0],
            color: COLORS[(Math.random() * COLORS.length) | 0],
            size: 14 + Math.random() * 12,
            rot: (Math.random() - 0.5) * 0.35,
            rotV: (Math.random() - 0.5) * 0.6,
            life: 0,
            maxLife: LIFETIME + Math.random() * 300
        });
    }

    let prevT = 0;

    function frame(now) {
        if (!running) return;
        if (!prevT) prevT = now;
        const dt = Math.min(now - prevT, 64);
        prevT = now;
        const dts = dt / 1000;

        ctx.clearRect(0, 0, cssW, cssH);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life += dt;
            if (p.life >= p.maxLife) {
                particles.splice(i, 1);
                continue;
            }
            const t = p.life / p.maxLife;

            p.x += p.vx * dts;
            p.y += p.vy * dts;
            p.vy += 6 * dts;
            p.rot += p.rotV * dts;

            let alpha;
            if (t < 0.12) alpha = t / 0.12;
            else alpha = 1 - (t - 0.12) / 0.88;
            if (alpha < 0) alpha = 0;

            const scale = 0.4 + t * 0.75;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(scale, scale);
            ctx.font = '700 ' + p.size.toFixed(1) + 'px Merriweather, "Noto Sans Devanagari", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(20, 12, 4, 0.45)';
            ctx.fillText(p.char, 1.2, 1.4);
            ctx.fillStyle = p.color;
            ctx.fillText(p.char, 0, 0);
            ctx.restore();
        }

        requestAnimationFrame(frame);
    }

    function start() {
        canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText =
            'position:fixed;top:0;left:0;pointer-events:none;' +
            'z-index:99998;mix-blend-mode:normal;';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d', { alpha: true });

        resize();
        window.addEventListener('resize', resize, { passive: true });
        document.addEventListener('mousemove', onMove, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                running = false;
                particles.length = 0;
                ctx.clearRect(0, 0, cssW, cssH);
            } else if (!running) {
                running = true;
                prevT = 0;
                requestAnimationFrame(frame);
            }
        });

        requestAnimationFrame(frame);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
