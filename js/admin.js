/* =============================================
   SaachoDharm Admin Panel - Logic
   ============================================= */

// ===== CONSTANTS =====
const STORAGE_KEYS = {
    bhajans: 'admin_bhajan_entries',
    tirths: 'admin_tirth_entries',
    calendar: 'admin_calendar_entries',
    bhajanDraft: 'admin_bhajan_draft',
    tirthDraft: 'admin_tirth_draft',
    calendarDraft: 'admin_calendar_draft'
};

const BHAJAN_DATA_URL = 'data/jainsaar_full_data.json';
const TIRTH_DATA_URL = 'data/tirth_sthal_data.json';
const CALENDAR_DATA_URL = 'data/calendar_data.json';

// ===== STATE =====
let originalBhajanData = [];
let originalTirthData = [];
let originalCalendarData = [];
let savedBhajans = [];
let savedTirths = [];
let savedCalendar = [];
let editingBhajanIndex = -1;
let editingTirthIndex = -1;
let editingCalendarIndex = -1;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // Load original data files
    await Promise.all([loadOriginalBhajanData(), loadOriginalTirthData(), loadOriginalCalendarData()]);

    // Load cached entries from localStorage
    loadFromCache();

    // Restore drafts
    restoreDraft('bhajan');
    restoreDraft('tirth');
    restoreDraft('calendar');

    // Setup auto-save on input
    setupAutoSave();

    // Setup custom category toggle
    setupCategoryToggle();

    // Setup char counters
    setupCharCounters();

    // Update UI
    updateAllCounts();
    renderBhajanList();
    renderTirthList();
    renderCalendarList();
    updateCacheStatus();
    updatePreviewStats();
});

// ===== LOAD ORIGINAL DATA =====
async function loadOriginalBhajanData() {
    try {
        const resp = await fetch(BHAJAN_DATA_URL);
        originalBhajanData = await resp.json();
    } catch (e) {
        console.warn('Could not load bhajan data:', e);
        originalBhajanData = [];
    }
}

async function loadOriginalTirthData() {
    try {
        const resp = await fetch(TIRTH_DATA_URL);
        originalTirthData = await resp.json();
    } catch (e) {
        console.warn('Could not load tirth data:', e);
        originalTirthData = [];
    }
}

async function loadOriginalCalendarData() {
    try {
        const resp = await fetch(CALENDAR_DATA_URL);
        originalCalendarData = await resp.json();
    } catch (e) {
        console.warn('Could not load calendar data:', e);
        originalCalendarData = [];
    }
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Update preview stats when switching to preview
    if (tabName === 'preview') {
        updatePreviewStats();
    }
}

// ===== LOCALSTORAGE =====
function saveToCache() {
    localStorage.setItem(STORAGE_KEYS.bhajans, JSON.stringify(savedBhajans));
    localStorage.setItem(STORAGE_KEYS.tirths, JSON.stringify(savedTirths));
    localStorage.setItem(STORAGE_KEYS.calendar, JSON.stringify(savedCalendar));
    updateCacheStatus();
}

function loadFromCache() {
    try {
        const bhajanCache = localStorage.getItem(STORAGE_KEYS.bhajans);
        const tirthCache = localStorage.getItem(STORAGE_KEYS.tirths);
        const calendarCache = localStorage.getItem(STORAGE_KEYS.calendar);
        if (bhajanCache) savedBhajans = JSON.parse(bhajanCache);
        if (tirthCache) savedTirths = JSON.parse(tirthCache);
        if (calendarCache) savedCalendar = JSON.parse(calendarCache);
    } catch (e) {
        console.warn('Error loading cache:', e);
    }
}

function clearAllCache() {
    if (!confirm('Are you sure you want to clear ALL saved data? This cannot be undone.')) return;
    savedBhajans = [];
    savedTirths = [];
    savedCalendar = [];
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    renderBhajanList();
    renderTirthList();
    renderCalendarList();
    updateAllCounts();
    updateCacheStatus();
    updatePreviewStats();
    showToast('All cached data cleared', 'info');
}

function updateCacheStatus() {
    const total = savedBhajans.length + savedTirths.length + savedCalendar.length;
    const el = document.getElementById('cacheStatus');
    const textEl = document.getElementById('cacheText');
    if (total > 0) {
        el.classList.add('has-data');
        textEl.textContent = `Cache: ${total} item${total !== 1 ? 's' : ''}`;
    } else {
        el.classList.remove('has-data');
        textEl.textContent = 'Cache: Empty';
    }
}

// ===== AUTO-SAVE DRAFTS =====
function setupAutoSave() {
    // Bhajan form fields
    const bhajanFields = ['bhajan-category', 'bhajan-title', 'bhajan-video', 'bhajan-audio', 'bhajan-link', 'bhajan-lyrics'];
    bhajanFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => saveDraft('bhajan'));
    });

    // Tirth form fields
    const tirthFields = [
        'tirth-id', 'tirth-name', 'tirth-nameHindi', 'tirth-type', 'tirth-category',
        'tirth-significance', 'tirth-deity', 'tirth-location', 'tirth-state',
        'tirth-lat', 'tirth-lng', 'tirth-shortDesc', 'tirth-desc',
        'tirth-timings', 'tirth-bestTime', 'tirth-howToReach', 'tirth-dharamshalaInfo'
    ];
    tirthFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => saveDraft('tirth'));
    });

    // Calendar form fields
    const calendarFields = ['cal-date', 'cal-name', 'cal-type', 'cal-desc'];
    calendarFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => saveDraft('calendar'));
    });

    // Also save on select change
    document.querySelectorAll('#bhajanForm select, #tirthForm select, #calendarForm select').forEach(sel => {
        sel.addEventListener('change', () => {
            const formType = sel.closest('#bhajanForm') ? 'bhajan' : sel.closest('#calendarForm') ? 'calendar' : 'tirth';
            saveDraft(formType);
        });
    });
}

function saveDraft(type) {
    if (type === 'bhajan') {
        const draft = {
            category: document.getElementById('bhajan-category').value,
            customCategory: document.getElementById('bhajan-category-custom').value,
            title: document.getElementById('bhajan-title').value,
            video: document.getElementById('bhajan-video').value,
            audio: document.getElementById('bhajan-audio').value,
            link: document.getElementById('bhajan-link').value,
            lyrics: document.getElementById('bhajan-lyrics').value
        };
        localStorage.setItem(STORAGE_KEYS.bhajanDraft, JSON.stringify(draft));
    } else if (type === 'calendar') {
        const draft = {
            date: document.getElementById('cal-date').value,
            name: document.getElementById('cal-name').value,
            type: document.getElementById('cal-type').value,
            desc: document.getElementById('cal-desc').value
        };
        localStorage.setItem(STORAGE_KEYS.calendarDraft, JSON.stringify(draft));
    } else {
        const draft = {
            id: document.getElementById('tirth-id').value,
            name: document.getElementById('tirth-name').value,
            nameHindi: document.getElementById('tirth-nameHindi').value,
            type: document.getElementById('tirth-type').value,
            category: document.getElementById('tirth-category').value,
            significance: document.getElementById('tirth-significance').value,
            deity: document.getElementById('tirth-deity').value,
            location: document.getElementById('tirth-location').value,
            state: document.getElementById('tirth-state').value,
            lat: document.getElementById('tirth-lat').value,
            lng: document.getElementById('tirth-lng').value,
            shortDesc: document.getElementById('tirth-shortDesc').value,
            desc: document.getElementById('tirth-desc').value,
            timings: document.getElementById('tirth-timings').value,
            bestTime: document.getElementById('tirth-bestTime').value,
            howToReach: document.getElementById('tirth-howToReach').value,
            hasDharamshala: document.getElementById('tirth-hasDharamshala').checked,
            dharamshalaInfo: document.getElementById('tirth-dharamshalaInfo').value,
            featured: document.getElementById('tirth-featured').checked
        };
        localStorage.setItem(STORAGE_KEYS.tirthDraft, JSON.stringify(draft));
    }
}

function restoreDraft(type) {
    try {
        if (type === 'bhajan') {
            const raw = localStorage.getItem(STORAGE_KEYS.bhajanDraft);
            if (!raw) return;
            const draft = JSON.parse(raw);
            if (draft.category) document.getElementById('bhajan-category').value = draft.category;
            if (draft.category === '__custom__') {
                document.getElementById('bhajan-category-custom').classList.remove('hidden');
                document.getElementById('bhajan-category-custom').value = draft.customCategory || '';
            }
            if (draft.title) document.getElementById('bhajan-title').value = draft.title;
            if (draft.video) document.getElementById('bhajan-video').value = draft.video;
            if (draft.audio) document.getElementById('bhajan-audio').value = draft.audio;
            if (draft.link) document.getElementById('bhajan-link').value = draft.link;
            if (draft.lyrics) document.getElementById('bhajan-lyrics').value = draft.lyrics;
            updateCharCount('bhajan-lyrics', 'lyricsCount');
        } else {
            const raw = localStorage.getItem(STORAGE_KEYS.tirthDraft);
            if (!raw) return;
            const draft = JSON.parse(raw);
            const fieldMap = {
                id: 'tirth-id', name: 'tirth-name', nameHindi: 'tirth-nameHindi',
                type: 'tirth-type', category: 'tirth-category', significance: 'tirth-significance',
                deity: 'tirth-deity', location: 'tirth-location', state: 'tirth-state',
                lat: 'tirth-lat', lng: 'tirth-lng', shortDesc: 'tirth-shortDesc',
                desc: 'tirth-desc', timings: 'tirth-timings', bestTime: 'tirth-bestTime',
                howToReach: 'tirth-howToReach', dharamshalaInfo: 'tirth-dharamshalaInfo'
            };
            for (const [key, elId] of Object.entries(fieldMap)) {
                if (draft[key]) document.getElementById(elId).value = draft[key];
            }
            if (draft.hasDharamshala) {
                document.getElementById('tirth-hasDharamshala').checked = true;
                toggleDharamshalaInfo();
            }
            if (draft.featured) {
                document.getElementById('tirth-featured').checked = true;
            }
            updateCharCount('tirth-shortDesc', 'shortDescCount', 200);
        }
    } catch (e) {
        console.warn('Error restoring draft:', e);
    }

    // Calendar draft
    if (type === 'calendar') {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.calendarDraft);
            if (!raw) return;
            const draft = JSON.parse(raw);
            if (draft.date) document.getElementById('cal-date').value = draft.date;
            if (draft.name) document.getElementById('cal-name').value = draft.name;
            if (draft.type) document.getElementById('cal-type').value = draft.type;
            if (draft.desc) document.getElementById('cal-desc').value = draft.desc;
        } catch (e) {
            console.warn('Error restoring calendar draft:', e);
        }
    }
}

// ===== CATEGORY TOGGLE =====
function setupCategoryToggle() {
    const catSelect = document.getElementById('bhajan-category');
    const catCustom = document.getElementById('bhajan-category-custom');
    catSelect.addEventListener('change', () => {
        if (catSelect.value === '__custom__') {
            catCustom.classList.remove('hidden');
            catCustom.focus();
        } else {
            catCustom.classList.add('hidden');
            catCustom.value = '';
        }
    });
}

// ===== CHAR COUNTERS =====
function setupCharCounters() {
    const lyricsEl = document.getElementById('bhajan-lyrics');
    if (lyricsEl) {
        lyricsEl.addEventListener('input', () => updateCharCount('bhajan-lyrics', 'lyricsCount'));
    }
    const shortDescEl = document.getElementById('tirth-shortDesc');
    if (shortDescEl) {
        shortDescEl.addEventListener('input', () => updateCharCount('tirth-shortDesc', 'shortDescCount', 200));
    }
}

function updateCharCount(inputId, countId, max) {
    const val = document.getElementById(inputId).value;
    const countEl = document.getElementById(countId);
    if (max) {
        countEl.textContent = `${val.length} / ${max}`;
        countEl.style.color = val.length > max ? 'var(--danger)' : '';
    } else {
        countEl.textContent = `${val.length} chars`;
    }
}

// ===== DYNAMIC LISTS =====
function addDynamicItem(listId, type, placeholder) {
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
        <input type="${type}" placeholder="${placeholder}" class="dynamic-input">
        <button type="button" class="btn-icon btn-remove" onclick="removeDynamicItem(this)" title="Remove">
            <i class="fas fa-times"></i>
        </button>
    `;
    list.appendChild(item);
    item.querySelector('input').focus();
}

function removeDynamicItem(btn) {
    const list = btn.closest('.dynamic-list');
    const item = btn.closest('.dynamic-item');
    // Keep at least one
    if (list.querySelectorAll('.dynamic-item').length > 1) {
        item.remove();
    } else {
        item.querySelector('input').value = '';
    }
}

function getDynamicValues(listId) {
    const inputs = document.querySelectorAll(`#${listId} .dynamic-input`);
    return Array.from(inputs).map(i => i.value.trim()).filter(v => v);
}

function setDynamicValues(listId, values, type, placeholder) {
    const list = document.getElementById(listId);
    list.innerHTML = '';
    if (!values || values.length === 0) values = [''];
    values.forEach(val => {
        const item = document.createElement('div');
        item.className = 'dynamic-item';
        item.innerHTML = `
            <input type="${type}" placeholder="${placeholder}" class="dynamic-input" value="${escapeHtml(val)}">
            <button type="button" class="btn-icon btn-remove" onclick="removeDynamicItem(this)" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        list.appendChild(item);
    });
}

// ===== DHARAMSHALA TOGGLE =====
function toggleDharamshalaInfo() {
    const checked = document.getElementById('tirth-hasDharamshala').checked;
    const group = document.getElementById('dharamshalaInfoGroup');
    if (checked) {
        group.classList.remove('hidden');
    } else {
        group.classList.add('hidden');
    }
}

// ===== BHAJAN SAVE =====
function saveBhajan(event) {
    event.preventDefault();

    const catSelect = document.getElementById('bhajan-category').value;
    let category = catSelect;
    if (catSelect === '__custom__') {
        category = document.getElementById('bhajan-category-custom').value.trim();
        if (!category) {
            showToast('Please enter a custom category name', 'error');
            return false;
        }
    }

    const categoryUrl = getCategoryUrl(category);

    const entry = {
        title: document.getElementById('bhajan-title').value.trim(),
        video: document.getElementById('bhajan-video').value.trim(),
        audio: document.getElementById('bhajan-audio').value.trim(),
        link: document.getElementById('bhajan-link').value.trim(),
        lyrics: document.getElementById('bhajan-lyrics').value.trim(),
        _category: category,
        _categoryUrl: categoryUrl
    };

    if (editingBhajanIndex >= 0) {
        savedBhajans[editingBhajanIndex] = entry;
        editingBhajanIndex = -1;
        showToast('Bhajan entry updated!', 'success');
    } else {
        savedBhajans.push(entry);
        showToast('Bhajan entry saved!', 'success');
    }

    saveToCache();
    renderBhajanList();
    updateAllCounts();
    updatePreviewStats();
    resetBhajanForm();
    return false;
}

function getCategoryUrl(categoryName) {
    // Try to find existing URL from original data
    const existing = originalBhajanData.find(c => c.category === categoryName);
    if (existing) return existing.url;
    // Generate a slug-based URL
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `https://jainsaar.com/${slug}`;
}

function resetBhajanForm() {
    document.getElementById('bhajanForm').reset();
    document.getElementById('bhajan-category-custom').classList.add('hidden');
    document.getElementById('bhajan-category-custom').value = '';
    editingBhajanIndex = -1;
    localStorage.removeItem(STORAGE_KEYS.bhajanDraft);
    updateCharCount('bhajan-lyrics', 'lyricsCount');
}

function editBhajan(index) {
    const entry = savedBhajans[index];
    if (!entry) return;

    editingBhajanIndex = index;

    // Check if category is a known one
    const catSelect = document.getElementById('bhajan-category');
    const knownCategories = Array.from(catSelect.options).map(o => o.value);
    if (knownCategories.includes(entry._category)) {
        catSelect.value = entry._category;
        document.getElementById('bhajan-category-custom').classList.add('hidden');
    } else {
        catSelect.value = '__custom__';
        document.getElementById('bhajan-category-custom').classList.remove('hidden');
        document.getElementById('bhajan-category-custom').value = entry._category;
    }

    document.getElementById('bhajan-title').value = entry.title;
    document.getElementById('bhajan-video').value = entry.video;
    document.getElementById('bhajan-audio').value = entry.audio;
    document.getElementById('bhajan-link').value = entry.link;
    document.getElementById('bhajan-lyrics').value = entry.lyrics;
    updateCharCount('bhajan-lyrics', 'lyricsCount');

    // Scroll to form
    document.getElementById('bhajanForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Editing bhajan entry...', 'info');
}

function deleteBhajan(index) {
    if (!confirm('Delete this bhajan entry?')) return;
    savedBhajans.splice(index, 1);
    saveToCache();
    renderBhajanList();
    updateAllCounts();
    updatePreviewStats();
    showToast('Bhajan entry deleted', 'info');
}

// ===== TIRTH SAVE =====
function saveTirth(event) {
    event.preventDefault();

    const lat = parseFloat(document.getElementById('tirth-lat').value);
    const lng = parseFloat(document.getElementById('tirth-lng').value);

    const entry = {
        id: document.getElementById('tirth-id').value.trim(),
        name: document.getElementById('tirth-name').value.trim(),
        nameHindi: document.getElementById('tirth-nameHindi').value.trim(),
        type: document.getElementById('tirth-type').value,
        shortDescription: document.getElementById('tirth-shortDesc').value.trim(),
        description: document.getElementById('tirth-desc').value.trim(),
        location: document.getElementById('tirth-location').value.trim(),
        state: document.getElementById('tirth-state').value,
        category: document.getElementById('tirth-category').value,
        significance: document.getElementById('tirth-significance').value,
        deity: document.getElementById('tirth-deity').value.trim(),
        coordinates: (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : { lat: 0, lng: 0 },
        images: getDynamicValues('tirth-images-list'),
        highlights: getDynamicValues('tirth-highlights-list'),
        timings: document.getElementById('tirth-timings').value.trim(),
        bestTimeToVisit: document.getElementById('tirth-bestTime').value.trim(),
        howToReach: document.getElementById('tirth-howToReach').value.trim(),
        hasDharamshala: document.getElementById('tirth-hasDharamshala').checked,
        dharamshalaInfo: document.getElementById('tirth-dharamshalaInfo').value.trim(),
        featured: document.getElementById('tirth-featured').checked
    };

    // Check for duplicate ID
    const dupIndex = savedTirths.findIndex((t, i) => t.id === entry.id && i !== editingTirthIndex);
    const origDup = originalTirthData.find(t => t.id === entry.id);
    if (dupIndex >= 0) {
        showToast('A saved entry with this ID already exists!', 'error');
        return false;
    }
    if (origDup && editingTirthIndex < 0) {
        showToast('This ID already exists in the original data!', 'error');
        return false;
    }

    if (editingTirthIndex >= 0) {
        savedTirths[editingTirthIndex] = entry;
        editingTirthIndex = -1;
        showToast('Tirth Sthal entry updated!', 'success');
    } else {
        savedTirths.push(entry);
        showToast('Tirth Sthal entry saved!', 'success');
    }

    saveToCache();
    renderTirthList();
    updateAllCounts();
    updatePreviewStats();
    resetTirthForm();
    return false;
}

function resetTirthForm() {
    document.getElementById('tirthForm').reset();
    document.getElementById('dharamshalaInfoGroup').classList.add('hidden');
    editingTirthIndex = -1;
    localStorage.removeItem(STORAGE_KEYS.tirthDraft);

    // Reset dynamic lists
    setDynamicValues('tirth-images-list', [''], 'url', 'https://example.com/image.jpg');
    setDynamicValues('tirth-highlights-list', [''], 'text', 'e.g. Key highlight...');
    updateCharCount('tirth-shortDesc', 'shortDescCount', 200);
}

function editTirth(index) {
    const entry = savedTirths[index];
    if (!entry) return;

    editingTirthIndex = index;

    document.getElementById('tirth-id').value = entry.id;
    document.getElementById('tirth-name').value = entry.name;
    document.getElementById('tirth-nameHindi').value = entry.nameHindi;
    document.getElementById('tirth-type').value = entry.type;
    document.getElementById('tirth-category').value = entry.category;
    document.getElementById('tirth-significance').value = entry.significance;
    document.getElementById('tirth-deity').value = entry.deity || '';
    document.getElementById('tirth-location').value = entry.location;
    document.getElementById('tirth-state').value = entry.state;
    document.getElementById('tirth-lat').value = entry.coordinates?.lat || '';
    document.getElementById('tirth-lng').value = entry.coordinates?.lng || '';
    document.getElementById('tirth-shortDesc').value = entry.shortDescription;
    document.getElementById('tirth-desc').value = entry.description;
    document.getElementById('tirth-timings').value = entry.timings || '';
    document.getElementById('tirth-bestTime').value = entry.bestTimeToVisit || '';
    document.getElementById('tirth-howToReach').value = entry.howToReach || '';
    document.getElementById('tirth-hasDharamshala').checked = entry.hasDharamshala;
    document.getElementById('tirth-dharamshalaInfo').value = entry.dharamshalaInfo || '';
    document.getElementById('tirth-featured').checked = entry.featured;

    toggleDharamshalaInfo();
    updateCharCount('tirth-shortDesc', 'shortDescCount', 200);

    // Set dynamic lists
    setDynamicValues('tirth-images-list', entry.images?.length ? entry.images : [''], 'url', 'https://example.com/image.jpg');
    setDynamicValues('tirth-highlights-list', entry.highlights?.length ? entry.highlights : [''], 'text', 'e.g. Key highlight...');

    // Scroll to form
    document.getElementById('tirthForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Editing tirth entry...', 'info');
}

function deleteTirth(index) {
    if (!confirm('Delete this tirth entry?')) return;
    savedTirths.splice(index, 1);
    saveToCache();
    renderTirthList();
    updateAllCounts();
    updatePreviewStats();
    showToast('Tirth entry deleted', 'info');
}

// ===== CALENDAR SAVE =====
function saveCalendar(event) {
    event.preventDefault();

    const entry = {
        date: document.getElementById('cal-date').value,
        name: document.getElementById('cal-name').value.trim(),
        type: document.getElementById('cal-type').value,
        desc: document.getElementById('cal-desc').value.trim()
    };

    if (editingCalendarIndex >= 0) {
        savedCalendar[editingCalendarIndex] = entry;
        editingCalendarIndex = -1;
        showToast('Calendar event updated!', 'success');
    } else {
        savedCalendar.push(entry);
        showToast('Calendar event saved!', 'success');
    }

    saveToCache();
    renderCalendarList();
    updateAllCounts();
    updatePreviewStats();
    resetCalendarForm();
    return false;
}

function resetCalendarForm() {
    document.getElementById('calendarForm').reset();
    editingCalendarIndex = -1;
    localStorage.removeItem(STORAGE_KEYS.calendarDraft);
}

function editCalendar(index) {
    const entry = savedCalendar[index];
    if (!entry) return;

    editingCalendarIndex = index;

    document.getElementById('cal-date').value = entry.date;
    document.getElementById('cal-name').value = entry.name;
    document.getElementById('cal-type').value = entry.type;
    document.getElementById('cal-desc').value = entry.desc || '';

    document.getElementById('calendarForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Editing calendar event...', 'info');
}

function deleteCalendar(index) {
    if (!confirm('Delete this calendar event?')) return;
    savedCalendar.splice(index, 1);
    saveToCache();
    renderCalendarList();
    updateAllCounts();
    updatePreviewStats();
    showToast('Calendar event deleted', 'info');
}

// ===== RENDER LISTS =====
function renderBhajanList() {
    const container = document.getElementById('bhajanList');
    const countEl = document.getElementById('bhajanSavedCount');
    countEl.textContent = savedBhajans.length;

    if (savedBhajans.length === 0) {
        container.innerHTML = '<p class="empty-state"><i class="fas fa-inbox"></i> No saved bhajan entries yet.</p>';
        return;
    }

    container.innerHTML = savedBhajans.map((entry, idx) => `
        <div class="entry-card">
            <div class="entry-info">
                <div class="entry-icon"><i class="fas fa-music"></i></div>
                <div class="entry-details">
                    <div class="entry-title">${escapeHtml(entry.title)}</div>
                    <div class="entry-meta">${escapeHtml(entry._category)} · ${entry.lyrics.length} chars</div>
                </div>
            </div>
            <div class="entry-actions">
                <button class="btn-icon btn-edit" onclick="editBhajan(${idx})" title="Edit">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteBhajan(${idx})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderTirthList() {
    const container = document.getElementById('tirthList');
    const countEl = document.getElementById('tirthSavedCount');
    countEl.textContent = savedTirths.length;

    if (savedTirths.length === 0) {
        container.innerHTML = '<p class="empty-state"><i class="fas fa-inbox"></i> No saved tirth entries yet.</p>';
        return;
    }

    container.innerHTML = savedTirths.map((entry, idx) => `
        <div class="entry-card">
            <div class="entry-info">
                <div class="entry-icon"><i class="fas fa-place-of-worship"></i></div>
                <div class="entry-details">
                    <div class="entry-title">${escapeHtml(entry.name)}</div>
                    <div class="entry-meta">${escapeHtml(entry.state)} · ${escapeHtml(entry.category)} · ${escapeHtml(entry.type)}</div>
                </div>
            </div>
            <div class="entry-actions">
                <button class="btn-icon btn-edit" onclick="editTirth(${idx})" title="Edit">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteTirth(${idx})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderCalendarList() {
    const container = document.getElementById('calendarList');
    const countEl = document.getElementById('calendarSavedCount');
    countEl.textContent = savedCalendar.length;

    if (savedCalendar.length === 0) {
        container.innerHTML = '<p class="empty-state"><i class="fas fa-inbox"></i> No saved calendar events yet.</p>';
        return;
    }

    const typeLabels = { festival: 'Festival', parv: 'Parv', auspicious: 'Auspicious' };
    container.innerHTML = savedCalendar.map((entry, idx) => `
        <div class="entry-card">
            <div class="entry-info">
                <div class="entry-icon"><i class="fas fa-calendar-day"></i></div>
                <div class="entry-details">
                    <div class="entry-title">${escapeHtml(entry.name)}</div>
                    <div class="entry-meta">${escapeHtml(entry.date)} · ${typeLabels[entry.type] || entry.type}</div>
                </div>
            </div>
            <div class="entry-actions">
                <button class="btn-icon btn-edit" onclick="editCalendar(${idx})" title="Edit">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteCalendar(${idx})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== COUNTS =====
function updateAllCounts() {
    document.getElementById('bhajanCount').textContent = savedBhajans.length;
    document.getElementById('tirthCount').textContent = savedTirths.length;
    document.getElementById('calendarCount').textContent = savedCalendar.length;
}

// ===== PREVIEW & DOWNLOAD =====
function updatePreviewStats() {
    const existingBhajanItems = originalBhajanData.reduce((sum, c) => sum + (c.items?.length || 0), 0);
    const newBhajanItems = savedBhajans.length;

    document.getElementById('previewBhajanExisting').textContent = existingBhajanItems;
    document.getElementById('previewBhajanNew').textContent = newBhajanItems;
    document.getElementById('previewBhajanTotal').textContent = existingBhajanItems + newBhajanItems;

    const existingTirth = originalTirthData.length;
    const newTirth = savedTirths.length;

    document.getElementById('previewTirthExisting').textContent = existingTirth;
    document.getElementById('previewTirthNew').textContent = newTirth;
    document.getElementById('previewTirthTotal').textContent = existingTirth + newTirth;

    const existingCalendar = originalCalendarData.length;
    const newCalendar = savedCalendar.length;

    document.getElementById('previewCalendarExisting').textContent = existingCalendar;
    document.getElementById('previewCalendarNew').textContent = newCalendar;
    document.getElementById('previewCalendarTotal').textContent = existingCalendar + newCalendar;

    // Enable/disable download buttons
    document.getElementById('downloadBhajanBtn').disabled = (newBhajanItems === 0 && existingBhajanItems === 0);
    document.getElementById('downloadTirthBtn').disabled = (newTirth === 0 && existingTirth === 0);
    document.getElementById('downloadCalendarBtn').disabled = (newCalendar === 0 && existingCalendar === 0);
}

function buildMergedBhajanData() {
    // Deep clone original
    const merged = JSON.parse(JSON.stringify(originalBhajanData));

    // Group new entries by category
    const grouped = {};
    savedBhajans.forEach(entry => {
        const cat = entry._category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({
            title: entry.title,
            video: entry.video,
            audio: entry.audio,
            link: entry.link,
            lyrics: entry.lyrics
        });
    });

    // Merge into existing categories or create new ones
    for (const [categoryName, items] of Object.entries(grouped)) {
        const existingCat = merged.find(c => c.category === categoryName);
        if (existingCat) {
            existingCat.items.push(...items);
        } else {
            // Get URL from entry metadata
            const entryWithUrl = savedBhajans.find(e => e._category === categoryName);
            merged.push({
                category: categoryName,
                url: entryWithUrl?._categoryUrl || '',
                items: items
            });
        }
    }

    return merged;
}

function buildMergedTirthData() {
    const merged = JSON.parse(JSON.stringify(originalTirthData));

    // Add new entries (skip duplicates by ID)
    savedTirths.forEach(entry => {
        const clean = { ...entry };
        delete clean._category; // Remove internal fields if any
        if (!merged.find(t => t.id === clean.id)) {
            merged.push(clean);
        }
    });

    return merged;
}

function downloadBhajanJSON() {
    const data = buildMergedBhajanData();
    downloadJSON(data, 'jainsaar_full_data.json');
    showToast('Bhajan JSON downloaded!', 'success');
}

function downloadTirthJSON() {
    const data = buildMergedTirthData();
    downloadJSON(data, 'tirth_sthal_data.json');
    showToast('Tirth Sthal JSON downloaded!', 'success');
}

function buildMergedCalendarData() {
    const merged = JSON.parse(JSON.stringify(originalCalendarData));
    // Add new entries (skip duplicates by date+name)
    savedCalendar.forEach(entry => {
        const exists = merged.find(e => e.date === entry.date && e.name === entry.name);
        if (!exists) {
            merged.push(entry);
        }
    });
    // Sort by date
    merged.sort((a, b) => a.date.localeCompare(b.date));
    return merged;
}

function downloadCalendarJSON() {
    const data = buildMergedCalendarData();
    downloadJSON(data, 'calendar_data.json');
    showToast('Calendar JSON downloaded!', 'success');
}

function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== JSON PREVIEW =====
let currentPreviewJSON = '';

function previewJSON(type) {
    let data, title;
    if (type === 'bhajan') {
        data = buildMergedBhajanData();
        title = 'jainsaar_full_data.json Preview';
    } else if (type === 'calendar') {
        data = buildMergedCalendarData();
        title = 'calendar_data.json Preview';
    } else {
        data = buildMergedTirthData();
        title = 'tirth_sthal_data.json Preview';
    }

    currentPreviewJSON = JSON.stringify(data, null, 2);
    document.getElementById('jsonPreviewTitle').textContent = title;
    document.getElementById('jsonPreviewCode').textContent = currentPreviewJSON;
    document.getElementById('jsonPreviewArea').classList.remove('hidden');

    // Scroll to preview
    document.getElementById('jsonPreviewArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closePreview() {
    document.getElementById('jsonPreviewArea').classList.add('hidden');
}

function copyJSON() {
    navigator.clipboard.writeText(currentPreviewJSON).then(() => {
        showToast('JSON copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = currentPreviewJSON;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('JSON copied to clipboard!', 'success');
    });
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3200);
}

// ===== UTILITY =====
function escapeHtml(str) {
    if (!str) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, m => map[m]);
}
