(function(){
    const STORAGE_KEY = 'sd_selected_theme';

    const presets = {
        "default": {
            "--saffron": "#ff6b35",
            "--golden": "#ffd700",
            "--bg-light-beige": "#faf8f5",
            "--bg-white": "#ffffff",
            "--bg-dark": "#2c3e50",
            "--bg-gradient-light": "linear-gradient(135deg, #faf8f5 0%, #f0ebe3 50%, #e8ddd4 100%)",
            "--bg-gradient-hero": "linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%)",
            "--bg-gradient-card": "linear-gradient(45deg, #ff6b35, #ffd700)",
            "--text-dark": "#2c3e50",
            "--text-light": "#7f8c8d",
            "--accent-saffron": "#ff6b35",
            "--accent-golden": "#ffd700",
            "--btn-primary-bg": "#ff6b35",
            "--btn-primary-text": "#ffffff",
            "--social-bg": "#ff6b35",
            "--social-hover": "#ffd700"
        },
        "coolBlue": {
            "--saffron": "#2b9af3",
            "--golden": "#74c0fc",
            "--bg-light-beige": "#f5f9ff",
            "--bg-white": "#ffffff",
            "--bg-dark": "#112b3c",
            "--bg-gradient-light": "linear-gradient(135deg,#f5f9ff 0%,#e6f1ff 50%,#d7e9ff 100%)",
            "--bg-gradient-hero": "linear-gradient(135deg,#eaf6ff 0%,#d6edff 100%)",
            "--bg-gradient-card": "linear-gradient(45deg,#2b9af3,#74c0fc)",
            "--text-dark": "#0b2a3a",
            "--text-light": "#5b7c8f",
            "--accent-saffron": "#2b9af3",
            "--accent-golden": "#74c0fc",
            "--btn-primary-bg": "#2b9af3",
            "--btn-primary-text": "#ffffff",
            "--social-bg": "#2b9af3",
            "--social-hover": "#74c0fc"
        },
        "royal": {
            "--saffron": "#7c3aed",
            "--golden": "#f59e0b",
            "--bg-light-beige": "#fbf7ff",
            "--bg-white": "#ffffff",
            "--bg-dark": "#1f2937",
            "--bg-gradient-light": "linear-gradient(135deg,#fbf7ff 0%,#f3e9ff 50%,#ecdbff 100%)",
            "--bg-gradient-hero": "linear-gradient(135deg,#f8f2ff 0%,#efddff 100%)",
            "--bg-gradient-card": "linear-gradient(45deg,#7c3aed,#f59e0b)",
            "--text-dark": "#111827",
            "--text-light": "#6b7280",
            "--accent-saffron": "#7c3aed",
            "--accent-golden": "#f59e0b",
            "--btn-primary-bg": "#7c3aed",
            "--btn-primary-text": "#ffffff",
            "--social-bg": "#7c3aed",
            "--social-hover": "#f59e0b"
        },
        "earthy": {
            "--saffron": "#1f8a70",
            "--golden": "#f6d365",
            "--bg-light-beige": "#fbfdf8",
            "--bg-white": "#ffffff",
            "--bg-dark": "#234e52",
            "--bg-gradient-light": "linear-gradient(135deg,#fbfdf8 0%,#eef6ec 50%,#e4f0e6 100%)",
            "--bg-gradient-hero": "linear-gradient(135deg,#f7fff8 0%,#e8fbeb 100%)",
            "--bg-gradient-card": "linear-gradient(45deg,#1f8a70,#f6d365)",
            "--text-dark": "#153b35",
            "--text-light": "#597b72",
            "--accent-saffron": "#1f8a70",
            "--accent-golden": "#f6d365",
            "--btn-primary-bg": "#1f8a70",
            "--btn-primary-text": "#ffffff",
            "--social-bg": "#1f8a70",
            "--social-hover": "#f6d365"
        },
        "sunrise": {
            "--saffron": "#ff7a18",
            "--golden": "#ffb56b",
            "--bg-light-beige": "#fff8f2",
            "--bg-white": "#ffffff",
            "--bg-dark": "#2b2b3a",
            "--bg-gradient-light": "linear-gradient(135deg,#fff8f2 0%,#ffe8d6 50%,#ffd3b3 100%)",
            "--bg-gradient-hero": "linear-gradient(135deg,#fff3ea 0%,#ffd8b8 100%)",
            "--bg-gradient-card": "linear-gradient(45deg,#ff7a18,#ffb56b)",
            "--text-dark": "#2b2b3a",
            "--text-light": "#7d6a60",
            "--accent-saffron": "#ff7a18",
            "--accent-golden": "#ffb56b",
            "--btn-primary-bg": "#ff7a18",
            "--btn-primary-text": "#ffffff",
            "--social-bg": "#ff7a18",
            "--social-hover": "#ffb56b"
        },
        "dark": {
            "--saffron": "#ffb86b",
            "--golden": "#ffd07a",
            "--bg-light-beige": "#121418",
            "--bg-white": "#0f1720",
            "--bg-dark": "#0b0f14",
            "--bg-gradient-light": "linear-gradient(135deg,#0f1720 0%,#0b1220 50%,#071017 100%)",
            "--bg-gradient-hero": "linear-gradient(135deg,#0b1220 0%,#071017 100%)",
            "--bg-gradient-card": "linear-gradient(45deg,#0b1220,#1f2937)",
            "--text-dark": "#e6eef6",
            "--text-light": "#9aa9b1",
            "--accent-saffron": "#ffb86b",
            "--accent-golden": "#ffd07a",
            "--btn-primary-bg": "#ffb86b",
            "--btn-primary-text": "#0b1220",
            "--social-bg": "#ffb86b",
            "--social-hover": "#ffd07a"
        }
    };

    function applyTheme(preset){
        const root = document.documentElement;
        Object.keys(preset).forEach(k => {
            try{ root.style.setProperty(k, preset[k]); }catch(e){}
        });
    }

    function setActiveSwatch(panel, id){
        panel.querySelectorAll('.theme-swatch').forEach(el=> el.style.borderColor = 'transparent');
        const el = panel.querySelector(`[data-theme="${id}"]`);
        if(el) el.style.borderColor = 'rgba(0,0,0,0.12)';
    }

    function saveTheme(id){
        localStorage.setItem(STORAGE_KEY, id);
    }

    function loadSavedTheme(){
        return localStorage.getItem(STORAGE_KEY);
    }

    function makeToggle(isCalendarPage){
        if (!isCalendarPage) {
            const btn = document.createElement('button');
            btn.className = 'theme-toggle';
            btn.title = 'Theme options';
            btn.setAttribute('aria-label','Theme options');
            btn.innerHTML = '<i class="fas fa-palette"></i>';
            return btn;
        }

        // Create the FAB hub container
        const hub = document.createElement('div');
        hub.className = 'fab-hub';
        hub.id = 'fabHub';

        // Main toggle button (gear / close)
        const toggle = document.createElement('button');
        toggle.className = 'fab-hub-toggle';
        toggle.title = 'Quick actions';
        toggle.setAttribute('aria-label', 'Quick actions');
        toggle.innerHTML = '<i class="fas fa-cog"></i><i class="fas fa-times"></i>';

        // Child items container
        const items = document.createElement('div');
        items.className = 'fab-hub-items';

        // Theme child
        const themeChild = document.createElement('button');
        themeChild.className = 'fab-child fab-child-theme';
        themeChild.id = 'fabThemeBtn';
        themeChild.setAttribute('data-label', 'Theme');
        themeChild.setAttribute('aria-label', 'Change theme');
        themeChild.innerHTML = '<i class="fas fa-palette"></i>';

        // Install child
        const installChild = document.createElement('button');
        installChild.className = 'fab-child fab-child-install';
        installChild.id = 'fabInstallBtn';
        installChild.setAttribute('data-label', 'Install App');
        installChild.setAttribute('aria-label', 'Install App');
        installChild.innerHTML = '<i class="fas fa-download"></i>';

        items.appendChild(installChild);
        items.appendChild(themeChild);
        hub.appendChild(items);
        hub.appendChild(toggle);

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'fab-hub-backdrop';

        // Toggle open/close
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            hub.classList.toggle('open');
            backdrop.classList.toggle('active', hub.classList.contains('open'));
            if (hub.classList.contains('open')) {
                hub.classList.remove('hide-labels');
            }
            // When closing the hub, also close the theme panel
            if (!hub.classList.contains('open')) {
                window.dispatchEvent(new CustomEvent('fab-hub-closed'));
            }
        });

        backdrop.addEventListener('click', () => {
            hub.classList.remove('open');
            backdrop.classList.remove('active');
            window.dispatchEvent(new CustomEvent('fab-hub-closed'));
        });

        document.body.appendChild(backdrop);

        // Store references for other scripts
        hub._themeChild = themeChild;
        hub._installChild = installChild;

        return hub;
    }

    function makePanel(){
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.innerHTML = '<h4>Choose a Theme</h4>';

        const list = document.createElement('div');
        list.className = 'theme-list';

        Object.keys(presets).forEach(key => {
            const sw = document.createElement('button');
            sw.className = 'theme-swatch';
            sw.setAttribute('data-theme', key);
            sw.setAttribute('title', key);
            sw.setAttribute('aria-label', key + ' theme');
            // show preview: use bg-gradient-card if present, otherwise color
            const p = presets[key];
            const bg = p['--bg-gradient-card'] || p['--btn-primary-bg'] || p['--saffron'];
            sw.style.background = bg;
            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = key;
            sw.appendChild(label);

            sw.addEventListener('click', ()=>{
                applyTheme(presets[key]);
                saveTheme(key);
                setActiveSwatch(panel, key);
            });

            list.appendChild(sw);
        });

        panel.appendChild(list);

        const actions = document.createElement('div');
        actions.className = 'theme-actions';

        const reset = document.createElement('button');
        reset.className = 'reset-btn';
        reset.textContent = 'Reset';
        reset.addEventListener('click', ()=>{
            applyTheme(presets['default']);
            localStorage.removeItem(STORAGE_KEY);
            setActiveSwatch(panel, 'default');
        });

        const randomBtn = document.createElement('button');
        randomBtn.className = 'random-btn';
        randomBtn.textContent = 'Random Gradient';
        randomBtn.addEventListener('click', ()=>{
            const g = randomGradient();
            const custom = Object.assign({}, presets['default']);
            custom['--bg-gradient-light'] = g.light;
            custom['--bg-gradient-hero'] = g.hero;
            custom['--bg-gradient-card'] = g.card;
            custom['--btn-primary-bg'] = g.accent;
            custom['--accent-saffron'] = g.accent;
            applyTheme(custom);
            saveTheme('custom');
            // mark none of the presets as active
            panel.querySelectorAll('.theme-swatch').forEach(el=> el.style.borderColor = 'transparent');
        });

        actions.appendChild(reset);
        actions.appendChild(randomBtn);
        panel.appendChild(actions);

        return panel;
    }

    function randomColor(){
        const r = ()=> Math.floor(Math.random()*205)+30;
        return `rgb(${r()},${r()},${r()})`;
    }

    function randomGradient(){
        const c1 = randomColor();
        const c2 = randomColor();
        const accent = randomColor();
        return {
            light: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
            hero: `linear-gradient(135deg, ${c2} 0%, ${c1} 100%)`,
            card: `linear-gradient(45deg, ${accent}, ${c2})`,
            accent
        };
    }

    // wire up
    document.addEventListener('DOMContentLoaded', ()=>{
        try{
            const currentPage = (window.location.pathname.split('/').pop() || '').toLowerCase();
            const isCalendarPage = currentPage === 'calendar.html';

            const toggleControl = makeToggle(isCalendarPage);
            const panel = makePanel();
            let open = false;

            if (isCalendarPage) {
                const hub = toggleControl;

                hub._themeChild.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    hub.classList.add('hide-labels');
                    if(!open){
                        document.body.appendChild(panel);
                        open = true;
                    } else {
                        if(panel.parentNode) panel.parentNode.removeChild(panel);
                        open = false;
                    }
                });

                hub._installChild.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    hub.classList.add('hide-labels');
                    hub.classList.remove('open');
                    const backdrop = document.querySelector('.fab-hub-backdrop');
                    if (backdrop) backdrop.classList.remove('active');
                    window.dispatchEvent(new CustomEvent('fab-install-click'));
                });

                document.body.appendChild(hub);
                window.__fabHub = hub;

                document.addEventListener('click', (e)=>{
                    if(!open) return;
                    if(e.target.closest('.theme-panel') || e.target.closest('.fab-hub')) return;
                    if(panel.parentNode) panel.parentNode.removeChild(panel);
                    open = false;
                    hub.classList.remove('open');
                    const backdrop = document.querySelector('.fab-hub-backdrop');
                    if (backdrop) backdrop.classList.remove('active');
                });

                window.addEventListener('fab-hub-closed', ()=>{
                    if(open && panel.parentNode){
                        panel.parentNode.removeChild(panel);
                        open = false;
                    }
                });
            } else {
                const toggle = toggleControl;

                toggle.addEventListener('click', ()=>{
                    if(!open){
                        document.body.appendChild(panel);
                        open = true;
                    } else {
                        if(panel.parentNode) panel.parentNode.removeChild(panel);
                        open = false;
                    }
                });

                document.body.appendChild(toggle);

                document.addEventListener('click', (e)=>{
                    if(!open) return;
                    if(e.target.closest('.theme-panel') || e.target.closest('.theme-toggle')) return;
                    if(panel.parentNode) panel.parentNode.removeChild(panel);
                    open = false;
                });
            }

            // apply saved theme or default
            const saved = loadSavedTheme();
            if(saved && presets[saved]){
                applyTheme(presets[saved]);
                // if panel exists later set active swatch
                setTimeout(()=> setActiveSwatch(panel, saved), 400);
            } else if(saved === 'custom'){
                // custom was random generated last time, keep as-is (localStorage key only)
            } else {
                applyTheme(presets['default']);
            }

        }catch(err){
            console.error('Theme switcher failed', err);
        }
    });
})();
