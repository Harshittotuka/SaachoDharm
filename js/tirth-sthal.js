/* =========================================
   TIRTH STHAL — Listing Page JS
   Search, filter, dynamic card rendering
   ========================================= */

(function () {
    'use strict';

    let allTirths = [];
    let filteredTirths = [];

    const grid = document.getElementById('ts-grid');
    const searchInput = document.getElementById('ts-search');
    const searchClear = document.getElementById('ts-search-clear');
    const filterType = document.getElementById('ts-filter-type');
    const filterCategory = document.getElementById('ts-filter-category');
    const filterState = document.getElementById('ts-filter-state');
    const filterSignificance = document.getElementById('ts-filter-significance');
    const activeFiltersEl = document.getElementById('ts-active-filters');
    const resultsCount = document.getElementById('ts-results-count');
    const noResults = document.getElementById('ts-no-results');
    const discoveryNote = document.getElementById('ts-discovery-note');
    const mapContainer = document.getElementById('ts-india-map');
    const mapClearBtn = document.getElementById('ts-map-clear');
    const mapOpenBtn = document.getElementById('ts-map-open');
    const mapOverlay = document.getElementById('ts-map-overlay');
    const mapCloseBtn = document.getElementById('ts-map-close');

    const INDIA_STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';
    const FALLBACK_TEMPLE_IMAGE = 'img/temple_alt.png';

    let indiaMap = null;
    let stateLayer = null;
    let selectedStateName = null;

    // Stats
    const statTotal = document.getElementById('stat-total');
    const statStates = document.getElementById('stat-states');
    const statLocalTemples = document.getElementById('stat-local-temples');

    // ---- Fetch data ----
    async function init() {
        try {
            const res = await fetch('data/tirth_sthal_data.json');
            if (!res.ok) throw new Error('Failed to load data');
            allTirths = await res.json();
            updateCollectionSEO();
            populateStateFilter();
            updateStats();
            initIndiaMap();
            applyFilters();
        } catch (err) {
            console.error('Error loading Tirth Sthal data:', err);
            if (grid) {
                grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#e74c3c;">Error loading content. Please refresh the page.</p>';
            }
        }
    }

    // ---- Populate state filter from data ----
    function populateStateFilter() {
        if (!filterState) return;
        const states = [...new Set(allTirths.map(t => t.state))].sort((a, b) => a.localeCompare(b));
        states.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            filterState.appendChild(opt);
        });
    }

    // ---- Animate counter ----
    function animateNumber(el, target) {
        if (!el) return;
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current;
        }, 30);
    }

    // ---- Update hero stats ----
    function updateStats() {
        const states = new Set(allTirths.map(t => t.state));
        const localTemples = allTirths.filter(t => t.type === 'Local Temple');

        animateNumber(statTotal, allTirths.length);
        animateNumber(statStates, states.size);
        animateNumber(statLocalTemples, localTemples.length);

        if (discoveryNote) {
            discoveryNote.innerHTML = '<strong>More discoveries coming soon</strong> — we are continuously adding new tirth sthals and local temples.';
        }
    }

    function upsertMeta(attrName, attrValue, content) {
        let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attrName, attrValue);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    function updateCollectionSEO() {
        const total = allTirths.length;
        const stateCount = new Set(allTirths.map(t => t.state)).size;
        const localTempleCount = allTirths.filter(t => t.type === 'Local Temple').length;
        const pageUrl = 'https://saachodharm.com/tirth-sthal';
        const pageTitle = `Jain Tirth Sthals & Local Temples (${total}) in India | SaachoDharm`;
        const pageDescription = `Explore ${total} Jain sacred places across ${stateCount} states, including ${localTempleCount} local temples. Discover Jain pilgrimage sites, timings, significance, and travel details.`;

        document.title = pageTitle;
        upsertMeta('name', 'description', pageDescription);
        upsertMeta('name', 'keywords', 'Jain tirth sthal, Jain temples India, Jain local temples, Jain pilgrimage sites, Digambar temple, Shwetambar temple');
        upsertMeta('property', 'og:title', pageTitle);
        upsertMeta('property', 'og:description', pageDescription);
        upsertMeta('property', 'og:url', pageUrl);
        upsertMeta('name', 'twitter:title', pageTitle);
        upsertMeta('name', 'twitter:description', pageDescription);

        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = pageUrl;

        const existingSchema = document.getElementById('ts-itemlist-schema');
        if (existingSchema) existingSchema.remove();

        const itemListElement = allTirths.slice(0, 30).map((t, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: t.name,
            url: `https://saachodharm.com/tirth/${encodeURIComponent(t.id)}`
        }));

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Jain Tirth Sthals and Local Temples',
            numberOfItems: total,
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            itemListElement
        };

        const script = document.createElement('script');
        script.id = 'ts-itemlist-schema';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // ---- Filter logic ----
    function applyFilters() {
        const query = (searchInput?.value || '').trim().toLowerCase();
        const type = filterType?.value || 'all';
        const cat = filterCategory?.value || 'all';
        const state = filterState?.value || 'all';
        const sig = filterSignificance?.value || 'all';

        filteredTirths = allTirths.filter(t => {
            const matchSearch = !query ||
                (t.name || '').toLowerCase().includes(query) ||
                (t.nameHindi || '').includes(query) ||
                (t.shortDescription || '').toLowerCase().includes(query) ||
                (t.location || '').toLowerCase().includes(query) ||
                (t.state || '').toLowerCase().includes(query) ||
                (t.deity || '').toLowerCase().includes(query) ||
                (t.type || '').toLowerCase().includes(query);

            const matchType = type === 'all' || t.type === type;
            const matchCat = cat === 'all' || t.category === cat;
            const matchState = state === 'all' || t.state === state;
            const matchSig = sig === 'all' || t.significance === sig;

            return matchSearch && matchType && matchCat && matchState && matchSig;
        });

        renderGrid();
        renderActiveFilters(query, type, cat, state, sig);
        updateResultsCount();
        highlightSelectedStateOnMap(state);
    }

    function normalizeStateName(name) {
        if (!name) return '';
        const cleaned = String(name)
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[()']/g, '')
            .replace(/\./g, '')
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const aliases = {
            'andaman and nicobar': 'Andaman and Nicobar Islands',
            'andaman and nicobar islands': 'Andaman and Nicobar Islands',
            'arunanchal pradesh': 'Arunachal Pradesh',
            'arunachal pradesh': 'Arunachal Pradesh',
            'nct of delhi': 'Delhi',
            'delhi nct': 'Delhi',
            'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
            'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
            'orissa': 'Odisha',
            'uttaranchal': 'Uttarakhand',
            'jammu and kashmir': 'Jammu and Kashmir',
            'telengana': 'Telangana',
            'telangana': 'Telangana'
        };

        return aliases[cleaned] || toTitleCase(cleaned);
    }

    function toTitleCase(value) {
        return value.replace(/\b\w/g, c => c.toUpperCase());
    }

    function getStateTempleCount(stateName) {
        return allTirths.filter(t => normalizeStateName(t.state) === stateName).length;
    }

    function getFilterStateValueFromMapState(mapStateName) {
        if (!filterState) return null;
        const options = Array.from(filterState.options || []);
        const matched = options.find(opt => normalizeStateName(opt.value) === mapStateName);
        return matched ? matched.value : null;
    }

    function initIndiaMap() {
        if (!mapContainer || typeof L === 'undefined') return;

        indiaMap = L.map(mapContainer, {
            zoomControl: true,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false
        });

        indiaMap.setView([22.5, 79], 4);

        fetch(INDIA_STATES_GEOJSON_URL)
            .then(res => {
                if (!res.ok) throw new Error('Unable to load India states map');
                return res.json();
            })
            .then(geojson => {
                stateLayer = L.geoJSON(geojson, {
                    style: feature => {
                        const mapStateName = normalizeStateName(feature?.properties?.NAME_1);
                        const hasTemples = getStateTempleCount(mapStateName) > 0;
                        return {
                            color: '#8d7d68',
                            weight: 1,
                            fillColor: hasTemples ? '#ffb347' : '#efe6d8',
                            fillOpacity: hasTemples ? 0.72 : 0.52
                        };
                    },
                    onEachFeature: (feature, layer) => {
                        const mapStateName = normalizeStateName(feature?.properties?.NAME_1);
                        const templeCount = getStateTempleCount(mapStateName);
                        const tooltipText = templeCount > 0
                            ? `${mapStateName}: ${templeCount} temple${templeCount > 1 ? 's' : ''}`
                            : `${mapStateName}: No temple data yet`;

                        layer.bindTooltip(tooltipText, {
                            sticky: true,
                            direction: 'top',
                            className: 'ts-map-state-tooltip'
                        });

                        layer.on('mouseover', () => {
                            layer.setStyle({ weight: 2, color: '#5c4a35' });
                        });

                        layer.on('mouseout', () => {
                            highlightSelectedStateOnMap(filterState?.value || 'all');
                        });

                        layer.on('click', () => {
                            if (!filterState) return;
                            if (templeCount === 0) return;
                            const filterValue = getFilterStateValueFromMapState(mapStateName);
                            if (!filterValue) return;
                            filterState.value = filterValue;
                            applyFilters();
                            document.querySelector('.ts-grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });
                    }
                }).addTo(indiaMap);

                indiaMap.fitBounds(stateLayer.getBounds(), { padding: [8, 8] });
                setTimeout(() => indiaMap.invalidateSize(), 120);
                highlightSelectedStateOnMap(filterState?.value || 'all');
            })
            .catch(err => {
                console.error('India map loading failed:', err);
                if (mapContainer) {
                    mapContainer.innerHTML = '<p style="padding:16px;text-align:center;color:#7f8c8d;">Map unavailable right now. You can still filter by state from the dropdown.</p>';
                }
            });
    }

    function highlightSelectedStateOnMap(stateValue) {
        if (!stateLayer) return;
        selectedStateName = stateValue === 'all' ? null : normalizeStateName(stateValue);

        stateLayer.eachLayer(layer => {
            const mapStateName = normalizeStateName(layer.feature?.properties?.NAME_1);
            const hasTemples = getStateTempleCount(mapStateName) > 0;
            const isSelected = !!selectedStateName && mapStateName === selectedStateName;

            layer.setStyle({
                color: isSelected ? '#e85d26' : '#8d7d68',
                weight: isSelected ? 2.2 : 1,
                fillColor: isSelected ? '#ff6b35' : (hasTemples ? '#ffb347' : '#efe6d8'),
                fillOpacity: isSelected ? 0.88 : (hasTemples ? 0.72 : 0.52)
            });
        });
    }

    // ---- Render cards ----
    function renderGrid() {
        if (!grid) return;
        grid.innerHTML = '';

        if (filteredTirths.length === 0) {
            grid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        grid.style.display = '';
        if (noResults) noResults.style.display = 'none';

        filteredTirths.forEach((t, idx) => {
            const card = document.createElement('a');
            card.href = `tirth-sthal-detail.html?tirth_id=${encodeURIComponent(t.id)}`;
            card.className = 'ts-card fade-in';
            card.style.animationDelay = `${idx * 0.06}s`;

            // Image
            const primaryImage = (t.images && t.images.length > 0) ? t.images[0] : FALLBACK_TEMPLE_IMAGE;
            const imgHtml = `<img src="${escapeHtml(primaryImage)}" alt="${escapeHtml(t.name)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_TEMPLE_IMAGE}'">`;

            // Badges
            let badges = '';
            if (t.featured) badges += `<span class="ts-badge ts-badge-featured">Featured</span>`;
            if (t.type) badges += `<span class="ts-badge ts-badge-type">${escapeHtml(t.type)}</span>`;
            badges += `<span class="ts-badge ts-badge-category">${escapeHtml(t.category)}</span>`;
            if (t.significance && t.significance !== 'Dharamshala' && t.significance !== 'Local Temple') badges += `<span class="ts-badge ts-badge-significance">${escapeHtml(t.significance)}</span>`;
            if (t.hasDharamshala) badges += `<span class="ts-badge ts-badge-dharamshala"><i class="fas fa-bed"></i> Dharamshala</span>`;

            card.innerHTML = `
                <div class="ts-card-img">
                    ${imgHtml}
                    <div class="ts-card-badges">${badges}</div>
                </div>
                <div class="ts-card-body">
                    <h3>${escapeHtml(t.name)}</h3>
                    <p class="ts-card-desc">${escapeHtml(t.shortDescription)}</p>
                    <div class="ts-card-footer">
                        <div class="ts-card-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${escapeHtml(t.location)}</span>
                        </div>
                        <div class="ts-card-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    // ---- Active filter tags ----
    function renderActiveFilters(query, type, cat, state, sig) {
        if (!activeFiltersEl) return;
        activeFiltersEl.innerHTML = '';

        const tags = [];
        if (query) tags.push({ label: `Search: "${query}"`, reset: () => { searchInput.value = ''; applyFilters(); } });
        if (type !== 'all') tags.push({ label: `Type: ${type}`, reset: () => { filterType.value = 'all'; applyFilters(); } });
        if (cat !== 'all') tags.push({ label: `Category: ${cat}`, reset: () => { filterCategory.value = 'all'; applyFilters(); } });
        if (state !== 'all') tags.push({ label: `State: ${state}`, reset: () => { filterState.value = 'all'; applyFilters(); } });
        if (sig !== 'all') tags.push({ label: `Significance: ${sig}`, reset: () => { filterSignificance.value = 'all'; applyFilters(); } });

        tags.forEach(tag => {
            const el = document.createElement('span');
            el.className = 'ts-filter-tag';
            el.innerHTML = `${escapeHtml(tag.label)} <i class="fas fa-times"></i>`;
            el.addEventListener('click', tag.reset);
            activeFiltersEl.appendChild(el);
        });
    }

    // ---- Results count ----
    function updateResultsCount() {
        if (!resultsCount) return;
        const total = allTirths.length;
        const shown = filteredTirths.length;
        resultsCount.textContent = shown === total
            ? `Showing all ${total} sacred places`
            : `Showing ${shown} of ${total} sacred places`;
    }

    // ---- Reset filters ----
    window.resetFilters = function () {
        if (searchInput) searchInput.value = '';
        if (filterCategory) filterCategory.value = 'all';
        if (filterState) filterState.value = 'all';
        if (filterType) filterType.value = 'all';
        if (filterSignificance) filterSignificance.value = 'all';
        applyFilters();
    };

    // ---- Escape HTML ----
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---- Debounce ----
    function debounce(fn, wait) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // ---- Event listeners ----
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            if (searchClear) searchClear.classList.toggle('visible', searchInput.value.length > 0);
            applyFilters();
        }, 250));
    }
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.classList.remove('visible');
            applyFilters();
            searchInput.focus();
        });
    }
    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);
    if (filterState) filterState.addEventListener('change', applyFilters);
    if (filterSignificance) filterSignificance.addEventListener('change', applyFilters);
    if (mapClearBtn) {
        mapClearBtn.addEventListener('click', () => {
            if (!filterState) return;
            filterState.value = 'all';
            applyFilters();
        });
    }

    function openMapOverlay() {
        if (!mapOverlay) return;
        mapOverlay.classList.add('is-open');
        mapOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('ts-map-overlay-open');
        setTimeout(() => {
            if (indiaMap) indiaMap.invalidateSize();
        }, 220);
    }

    function closeMapOverlay() {
        if (!mapOverlay) return;
        mapOverlay.classList.remove('is-open');
        mapOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('ts-map-overlay-open');
    }

    if (mapOpenBtn) {
        mapOpenBtn.addEventListener('click', openMapOverlay);
    }

    if (mapCloseBtn) {
        mapCloseBtn.addEventListener('click', closeMapOverlay);
    }

    if (mapOverlay) {
        mapOverlay.addEventListener('click', (event) => {
            const modal = mapOverlay.querySelector('.ts-map-modal');
            if (modal && !modal.contains(event.target)) {
                closeMapOverlay();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mapOverlay?.classList.contains('is-open')) {
            closeMapOverlay();
        }
    });

    // ---- Check for URL params ----
    function checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        const state = params.get('state');
        if (cat && filterCategory) filterCategory.value = cat;
        if (state && filterState) {
            // wait for options to populate
            setTimeout(() => { filterState.value = state; applyFilters(); }, 100);
        }
    }

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', () => {
        init().then(checkUrlParams);
    });
})();
