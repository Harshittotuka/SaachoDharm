/* =========================================
   JAIN CALENDAR — Interactive Engine
   Complete Panchang with Tithis, Parvs,
   festivals and Chandramasi months.
   ========================================= */

(function () {
    'use strict';

    /* ------------------------------------------------
       JAIN MONTHS (Chandramasi — Shukla-starting)
       ------------------------------------------------ */
    const JAIN_MONTHS = [
        { name: 'Kartik',    emoji: '🪔', greg: 'Oct–Nov',  desc: 'Diwali & New Year month' },
        { name: 'Margshirsh', emoji: '❄️', greg: 'Nov–Dec',  desc: 'Maun Ekadashi month' },
        { name: 'Paush',     emoji: '🌨️', greg: 'Dec–Jan',  desc: 'Winter devotion month' },
        { name: 'Magh',      emoji: '🔥', greg: 'Jan–Feb',  desc: 'Rishi Panchami month' },
        { name: 'Falgun',    emoji: '🌸', greg: 'Feb–Mar',  desc: 'Holi & spring prayers' },
        { name: 'Chaitra',   emoji: '🌺', greg: 'Mar–Apr',  desc: 'Nav Varsh begins' },
        { name: 'Vaishakh',  emoji: '☀️', greg: 'Apr–May',  desc: 'Akshaya Tritiya month' },
        { name: 'Jyeshtha',  emoji: '🌞', greg: 'May–Jun',  desc: 'Summer fasting month' },
        { name: 'Ashadh',    emoji: '🌧️', greg: 'Jun–Jul',  desc: 'Chaumasa begins' },
        { name: 'Shravan',   emoji: '🕉️', greg: 'Jul–Aug',  desc: 'Paryushana Parv month' },
        { name: 'Bhadrapad', emoji: '🙏', greg: 'Aug–Sep',  desc: 'Dashlakshan / Samvatsari' },
        { name: 'Ashwin',    emoji: '🍂', greg: 'Sep–Oct',  desc: 'Navratri & closure' }
    ];

    /* ------------------------------------------------
       TITHI NAMES (1-30 in a lunar month — repeating
       15 for Shukla and 15 for Krishna paksha)
       ------------------------------------------------ */
    const TITHI_NAMES = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
    ];

    /* ------------------------------------------------
       PARV TITHIS — These Tithis are always sacred
       in Jainism (Shukla & Krishna both)
       2, 5, 8, 11, 14 + Purnima(15) + Amavasya(30)
       ------------------------------------------------ */
    const PARV_TITHI_INDICES = new Set([2, 5, 8, 11, 14, 15, 17, 20, 23, 26, 29, 30]);

    /* ------------------------------------------------
       MAJOR JAIN FESTIVALS (keyed by month-day
       using Gregorian dates for 2025-2027 cycle)
       Format: { 'YYYY-MM-DD': [{ name, type, desc }] }
       ------------------------------------------------ */
    const FESTIVALS = {
        // ===== 2025 =====
        '2025-01-10': [{ name: 'Mauni Amavasya', type: 'auspicious', desc: 'Day of silent meditation and fasting.' }],
        '2025-01-14': [{ name: 'Makar Sankranti', type: 'auspicious', desc: 'Sun enters Makar rashi — auspicious for charity.' }],
        '2025-02-12': [{ name: 'Magh Shukla Purnima', type: 'parv', desc: 'Full moon of Magh — sacred bathing and prayers.' }],
        '2025-02-26': [{ name: 'Panchami (Rishi Panchami)', type: 'parv', desc: 'Observance of penance and fasting.' }],
        '2025-03-14': [{ name: 'Holi Purnima', type: 'festival', desc: 'Falgun Purnima — community celebrations.' }],
        '2025-03-31': [{ name: 'Chaitra Shukla Pratipada', type: 'festival', desc: 'Hindu / Jain New Year (Vikram Samvat).' }],
        '2025-04-01': [{ name: 'Nav Varsh', type: 'festival', desc: 'Beginning of new Vikram Samvat year.' }],
        '2025-04-10': [{ name: 'Mahavir Jayanti', type: 'festival', desc: 'Birth anniversary of Lord Mahavira — the 24th Tirthankara. Grand processions and abhishek in every Jain temple.' }],
        '2025-04-14': [{ name: 'Chaitra Purnima', type: 'parv', desc: 'Full moon of Chaitra — Dana-Punya.' }],
        '2025-05-01': [{ name: 'Akshaya Tritiya', type: 'festival', desc: 'Lord Rishabhdeva broke his first fast with sugarcane juice — day of eternal merit.' }],
        '2025-05-12': [{ name: 'Buddha / Vaishakh Purnima', type: 'parv', desc: 'Vaishakh full moon — sacred fasting.' }],
        '2025-06-10': [{ name: 'Nirjala Ekadashi', type: 'parv', desc: 'Waterless fasting Ekadashi — highly meritorious.' }],
        '2025-07-10': [{ name: 'Chaumasa Begins (Guru Purnima)', type: 'festival', desc: 'Start of the four-month monsoon retreat for monks and devotees. Special vows taken.' }],
        '2025-08-06': [{ name: 'Shravan Shukla Ashtami', type: 'parv', desc: 'Sacred eighth day of Shravan — important parv tithi.' }],
        '2025-08-23': [{ name: 'Paryushana Begins (Shvetambar)', type: 'festival', desc: 'Eight days of intense fasting, prayer and self-reflection. The holiest period for Shvetambar Jains.' }],
        '2025-08-24': [{ name: 'Paryushana Day 2', type: 'festival', desc: 'Continuation of Paryushana — devotional lectures and fasting.' }],
        '2025-08-25': [{ name: 'Paryushana Day 3', type: 'festival', desc: 'Spiritual discourses and scriptural study.' }],
        '2025-08-26': [{ name: 'Paryushana Day 4', type: 'festival', desc: 'Intensified fasting — Atthai / Upvas.' }],
        '2025-08-27': [{ name: 'Paryushana Day 5', type: 'festival', desc: 'Pratikraman and self-purification.' }],
        '2025-08-28': [{ name: 'Paryushana Day 6', type: 'festival', desc: 'Sutra recitation and charitable giving.' }],
        '2025-08-29': [{ name: 'Paryushana Day 7', type: 'festival', desc: 'Penultimate day — deep meditation.' }],
        '2025-08-30': [{ name: 'Samvatsari (Forgiveness Day)', type: 'festival', desc: 'Final day of Paryushana — "Micchami Dukkadam" — universal forgiveness. The most sacred day in Jainism.' }],
        '2025-08-31': [{ name: 'Dashlakshan Begins (Digambar)', type: 'festival', desc: 'Ten-day festival of supreme virtues for Digambar Jains.' }],
        '2025-09-01': [{ name: 'Dashlakshan Day 2 — Mardava (Humility)', type: 'festival', desc: 'Observance of humility and gentle conduct.' }],
        '2025-09-02': [{ name: 'Dashlakshan Day 3 — Arjava (Straightforwardness)', type: 'festival', desc: 'Practice of sincerity and honesty.' }],
        '2025-09-03': [{ name: 'Dashlakshan Day 4 — Shaucha (Purity)', type: 'festival', desc: 'Inner and outer cleanliness.' }],
        '2025-09-04': [{ name: 'Dashlakshan Day 5 — Satya (Truth)', type: 'festival', desc: 'Commitment to truthfulness.' }],
        '2025-09-05': [{ name: 'Dashlakshan Day 6 — Sanyam (Self-Restraint)', type: 'festival', desc: 'Practice of restraint over senses and mind.' }],
        '2025-09-06': [{ name: 'Dashlakshan Day 7 — Tapa (Austerity)', type: 'festival', desc: 'Observance of penance and fasting.' }],
        '2025-09-07': [{ name: 'Dashlakshan Day 8 — Tyaga (Renunciation)', type: 'festival', desc: 'Letting go of attachments and material desires.' }],
        '2025-09-08': [{ name: 'Dashlakshan Day 9 — Akinchanya (Non-Possessiveness)', type: 'festival', desc: 'Practicing detachment from worldly possessions.' }],
        '2025-09-09': [{ name: 'Dashlakshan Day 10 — Brahmacharya (Celibacy)', type: 'festival', desc: 'Final day — observance of supreme celibacy and purity.' }],
        '2025-09-14': [{ name: 'Anant Chaturdashi', type: 'parv', desc: 'Chaturdashi parv — fasting and prayer.' }],
        '2025-10-02': [{ name: 'Sharad Purnima', type: 'parv', desc: 'Ashwin Purnima — night-long meditation.' }],
        '2025-10-20': [{ name: 'Diwali (Jain New Year Eve)', type: 'festival', desc: 'Lord Mahavira attained Nirvana (Moksha). Deepak Puja and final Namokar Mantra of the year.' }],
        '2025-10-21': [{ name: 'Jain New Year (Vikram Samvat 2082)', type: 'festival', desc: 'Kartik Shukla Pratipada — beginning of new Jain year. Visit temples and seek blessings.' }],
        '2025-10-22': [{ name: 'Bhai Dooj / Yama Dwitiya', type: 'auspicious', desc: 'Celebration of sibling bond.' }],
        '2025-11-01': [{ name: 'Gyaras (Kartik Ekadashi)', type: 'parv', desc: 'Ekadashi fasting — highly meritorious.' }],
        '2025-11-05': [{ name: 'Kartik Purnima', type: 'parv', desc: 'Sacred full moon — pilgrimage and fasting.' }],
        '2025-12-25': [{ name: 'Paush Dashami', type: 'parv', desc: 'Dashami tithi observance.' }],

        // ===== 2026 =====
        '2026-01-29': [{ name: 'Mauni Amavasya', type: 'auspicious', desc: 'Silent meditation and fasting day.' }],
        '2026-01-14': [{ name: 'Makar Sankranti', type: 'auspicious', desc: 'Sun transitions — auspicious charity day.' }],
        '2026-03-03': [{ name: 'Holi Purnima', type: 'festival', desc: 'Falgun Purnima — celebration of colors.' }],
        '2026-03-20': [{ name: 'Chaitra Shukla Pratipada', type: 'festival', desc: 'Nav Varsh — Jain New Year celebration.' }],
        '2026-03-29': [{ name: 'Mahavir Jayanti', type: 'festival', desc: 'Birth anniversary of Bhagwan Mahavira — the 24th Tirthankara. Abhishek and processions at all Jain temples.' }],
        '2026-04-19': [{ name: 'Akshaya Tritiya', type: 'festival', desc: 'Rishabhdeva\'s first Parna — eternal merit day.' }],
        '2026-05-31': [{ name: 'Nirjala Ekadashi', type: 'parv', desc: 'Waterless Ekadashi fasting.' }],
        '2026-06-29': [{ name: 'Guru Purnima / Chaumasa Start', type: 'festival', desc: 'Chaturmas begins — monks stay at one place.' }],
        '2026-08-12': [{ name: 'Paryushana Begins (Shvetambar)', type: 'festival', desc: 'Eight sacred days of fasting, atthai and pratikraman begin.' }],
        '2026-08-19': [{ name: 'Samvatsari (Forgiveness Day)', type: 'festival', desc: 'Micchami Dukkadam — seeking and granting forgiveness from all beings.' }],
        '2026-08-20': [{ name: 'Dashlakshan Begins (Digambar)', type: 'festival', desc: 'Ten-day festival of ten supreme virtues.' }],
        '2026-08-29': [{ name: 'Dashlakshan Ends (Anant Chaturdashi)', type: 'festival', desc: 'Concluding day of Dashlakshan Parv.' }],
        '2026-09-03': [{ name: 'Anant Chaturdashi', type: 'parv', desc: 'Sacred Chaturdashi — fasting and devotion.' }],
        '2026-10-09': [{ name: 'Diwali (Nirvana of Mahavira)', type: 'festival', desc: 'Lord Mahavira\'s Moksha Divas — Deepak Puja and year-end prayers.' }],
        '2026-10-10': [{ name: 'Jain New Year (Vikram Samvat 2083)', type: 'festival', desc: 'Kartik Shukla Pratipada — new year begins.' }],
        '2026-10-25': [{ name: 'Kartik Purnima', type: 'parv', desc: 'Full moon of Kartik — pilgrimage day.' }],

        // ===== 2027 =====
        '2027-01-14': [{ name: 'Makar Sankranti', type: 'auspicious', desc: 'Auspicious transition — charity and prayers.' }],
        '2027-03-22': [{ name: 'Holi Purnima', type: 'festival', desc: 'Falgun Purnima.' }],
        '2027-03-29': [{ name: 'Mahavir Jayanti', type: 'festival', desc: 'Bhagwan Mahavira birth anniversary celebrations.' }],
        '2027-04-08': [{ name: 'Chaitra Shukla Pratipada / Nav Varsh', type: 'festival', desc: 'Jain New Year.' }],
        '2027-05-09': [{ name: 'Akshaya Tritiya', type: 'festival', desc: 'Day of eternal merit — Rishabhdeva Parna.' }],
        '2027-07-18': [{ name: 'Guru Purnima / Chaumasa Start', type: 'festival', desc: 'Beginning of rainy retreat.' }],
        '2027-09-01': [{ name: 'Paryushana Begins', type: 'festival', desc: 'Eight holy days begin.' }],
        '2027-09-08': [{ name: 'Samvatsari', type: 'festival', desc: 'Forgiveness Day — Micchami Dukkadam.' }],
        '2027-09-09': [{ name: 'Dashlakshan Begins', type: 'festival', desc: 'Ten virtues festival begins (Digambar).' }],
        '2027-10-29': [{ name: 'Diwali (Mahavira Nirvana)', type: 'festival', desc: 'Moksha Divas of Bhagwan Mahavira.' }],
        '2027-10-30': [{ name: 'Jain New Year', type: 'festival', desc: 'Kartik Shukla Pratipada.' }]
    };

    /* ------------------------------------------------
       TITHI CALC — approximate lunar tithi for a date
       Based on synodic month algorithm
       ------------------------------------------------ */
    // Known new moon reference: Jan 6, 2000 18:14 UTC
    const NEW_MOON_REF = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const SYNODIC_MONTH = 29.53058868;

    function getLunarDay(date) {
        const diffMs = date.getTime() - NEW_MOON_REF.getTime();
        const diffDays = diffMs / 86400000;
        const moonAge = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
        const tithi = Math.floor(moonAge / (SYNODIC_MONTH / 30)) + 1;
        return Math.min(tithi, 30);
    }

    function getTithiName(tithiNum) {
        const idx = ((tithiNum - 1) % 15);
        return TITHI_NAMES[idx];
    }

    function getPaksha(tithiNum) {
        return tithiNum <= 15 ? 'Shukla' : 'Krishna';
    }

    function isParv(tithiNum) {
        return PARV_TITHI_INDICES.has(tithiNum);
    }

    /* ------------------------------------------------
       APPROXIMATE JAIN MONTH from Gregorian date
       (simplified — based on lunar month mapping)
       ------------------------------------------------ */
    function getJainMonthIndex(date) {
        const m = date.getMonth(); // 0-based
        // Rough mapping: Kartik starts ~Oct, so month 9 → index 0
        const mapping = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];
        return mapping[m];
    }

    /* ------------------------------------------------
       DOM REFERENCES
       ------------------------------------------------ */
    const calGrid      = document.getElementById('calGrid');
    const monthTitle    = document.getElementById('monthTitle');
    const jainMonthEl   = document.getElementById('jainMonthTitle');
    const prevBtn       = document.getElementById('prevMonth');
    const nextBtn       = document.getElementById('nextMonth');
    const todayBtn      = document.getElementById('todayBtn');
    const detailPanel   = document.getElementById('detailPanel');
    const detailClose   = document.getElementById('detailClose');
    const detailDate    = document.getElementById('detailDate');
    const detailTithi   = document.getElementById('detailTithi');
    const detailBody    = document.getElementById('detailBody');
    const upcomingGrid  = document.getElementById('upcomingGrid');
    const jainMonthsGrid = document.getElementById('jainMonthsGrid');

    const GREG_MONTHS = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];
    const GREG_WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    let currentYear, currentMonth; // 0-based month

    /* ------------------------------------------------
       RENDER CALENDAR GRID
       ------------------------------------------------ */
    function renderCalendar(year, month) {
        currentYear = year;
        currentMonth = month;

        // Title
        monthTitle.textContent = `${GREG_MONTHS[month]} ${year}`;

        // Jain month label
        const midDate = new Date(year, month, 15);
        const jIdx = getJainMonthIndex(midDate);
        jainMonthEl.textContent = `${JAIN_MONTHS[jIdx].emoji} ${JAIN_MONTHS[jIdx].name} (${JAIN_MONTHS[jIdx].greg})`;

        // Build days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        let html = '';

        // Empty cells before 1st
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="cal-day empty"></div>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayOfWeek = date.getDay();
            const tithi = getLunarDay(date);
            const tithiName = getTithiName(tithi);
            const paksha = getPaksha(tithi);
            const parvDay = isParv(tithi);
            const events = FESTIVALS[dateStr] || [];
            const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d);

            let classes = 'cal-day';
            if (dayOfWeek === 0) classes += ' sunday';
            if (isToday) classes += ' today';

            // Dots
            let dots = '';
            if (parvDay) dots += '<span class="day-dot parv"></span>';
            events.forEach(e => {
                dots += `<span class="day-dot ${e.type}"></span>`;
            });

            // Label (show first event or Parv)
            let label = '';
            if (events.length) {
                const e = events[0];
                label = `<div class="day-label ${e.type}" title="${e.name}">${e.name}</div>`;
            } else if (parvDay) {
                label = `<div class="day-label parv" title="Parv Tithi">Parv</div>`;
            }

            html += `
                <div class="${classes}" data-date="${dateStr}" data-tithi="${tithi}" onclick="window._calSelectDay(this)">
                    <span class="day-num">${d}</span>
                    <span class="day-tithi">${paksha} ${tithiName}</span>
                    <div class="day-dots">${dots}</div>
                    ${label}
                </div>`;
        }

        calGrid.innerHTML = html;

        // Scroll to today if visible
        if (today.getFullYear() === year && today.getMonth() === month) {
            const todayEl = calGrid.querySelector('.cal-day.today');
            if (todayEl) todayEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Close detail
        detailPanel.classList.remove('open');

        // Update Jain months grid active state
        updateJainMonthsActive(jIdx);
    }

    /* ------------------------------------------------
       SELECT A DAY → show detail panel
       ------------------------------------------------ */
    window._calSelectDay = function (el) {
        // Remove prev selection
        calGrid.querySelectorAll('.cal-day.selected').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');

        const dateStr = el.dataset.date;
        const tithi = parseInt(el.dataset.tithi, 10);
        const parts = dateStr.split('-');
        const date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        const tithiName = getTithiName(tithi);
        const paksha = getPaksha(tithi);
        const parvDay = isParv(tithi);
        const events = FESTIVALS[dateStr] || [];

        detailDate.textContent = `${GREG_WEEKDAYS[date.getDay()]}, ${date.getDate()} ${GREG_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
        detailTithi.textContent = `${paksha} ${tithiName} (Tithi ${tithi})`;

        let bodyHTML = '';

        if (parvDay) {
            bodyHTML += `
                <div class="detail-event parv">
                    <span class="event-icon">⭐</span>
                    <div class="event-info">
                        <h4>Parv Tithi</h4>
                        <p>${paksha} ${tithiName} — one of the sacred Parv Tithis. Fasting, Samayik, Pratikraman and temple visits are especially meritorious today.</p>
                    </div>
                </div>`;
        }

        events.forEach(e => {
            const icon = e.type === 'festival' ? '🔔' : e.type === 'parv' ? '⭐' : '☀️';
            bodyHTML += `
                <div class="detail-event ${e.type}">
                    <span class="event-icon">${icon}</span>
                    <div class="event-info">
                        <h4>${e.name}</h4>
                        <p>${e.desc}</p>
                    </div>
                </div>`;
        });

        if (!parvDay && !events.length) {
            bodyHTML += `<p>No special events on this day. Regular ${paksha} ${tithiName} tithi.</p>`;
        }

        detailBody.innerHTML = bodyHTML;
        detailPanel.classList.add('open');
        detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    /* ------------------------------------------------
       NAVIGATION
       ------------------------------------------------ */
    prevBtn.addEventListener('click', () => {
        let m = currentMonth - 1, y = currentYear;
        if (m < 0) { m = 11; y--; }
        renderCalendar(y, m);
    });
    nextBtn.addEventListener('click', () => {
        let m = currentMonth + 1, y = currentYear;
        if (m > 11) { m = 0; y++; }
        renderCalendar(y, m);
    });
    todayBtn.addEventListener('click', () => {
        const t = new Date();
        renderCalendar(t.getFullYear(), t.getMonth());
    });
    detailClose.addEventListener('click', () => {
        detailPanel.classList.remove('open');
        calGrid.querySelectorAll('.cal-day.selected').forEach(e => e.classList.remove('selected'));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        else if (e.key === 'ArrowRight') nextBtn.click();
        else if (e.key === 'Escape') detailClose.click();
    });

    /* ------------------------------------------------
       UPCOMING FESTIVALS
       ------------------------------------------------ */
    function renderUpcoming() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = [];

        Object.entries(FESTIVALS).forEach(([dateStr, evts]) => {
            const parts = dateStr.split('-');
            const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
            if (d >= today) {
                evts.forEach(e => {
                    upcoming.push({ date: d, dateStr, ...e });
                });
            }
        });

        upcoming.sort((a, b) => a.date - b.date);
        const show = upcoming.slice(0, 8);

        let html = '';
        show.forEach(e => {
            const icon = e.type === 'festival' ? 'fas fa-bell' : e.type === 'parv' ? 'fas fa-star' : 'fas fa-sun';
            const dayStr = `${e.date.getDate()} ${GREG_MONTHS[e.date.getMonth()]} ${e.date.getFullYear()}`;
            const daysAway = Math.ceil((e.date - today) / 86400000);
            const daysLabel = daysAway === 0 ? 'Today!' : daysAway === 1 ? 'Tomorrow' : `in ${daysAway} days`;
            html += `
                <div class="upcoming-card">
                    <div class="upcoming-icon ${e.type}"><i class="${icon}"></i></div>
                    <div class="upcoming-info">
                        <h4>${e.name}</h4>
                        <span>${dayStr} · ${daysLabel}</span>
                    </div>
                </div>`;
        });

        if (!show.length) {
            html = '<p style="color:var(--text-light)">No upcoming festivals in the database for this period.</p>';
        }

        upcomingGrid.innerHTML = html;
    }

    /* ------------------------------------------------
       JAIN MONTHS REFERENCE GRID
       ------------------------------------------------ */
    function renderJainMonths() {
        let html = '';
        JAIN_MONTHS.forEach((m, i) => {
            html += `
                <div class="jain-month-card" data-idx="${i}" onclick="window._calJumpToJainMonth(${i})">
                    <div class="month-emoji">${m.emoji}</div>
                    <h4>${m.name}</h4>
                    <span>${m.greg}</span>
                </div>`;
        });
        jainMonthsGrid.innerHTML = html;
    }

    function updateJainMonthsActive(idx) {
        jainMonthsGrid.querySelectorAll('.jain-month-card').forEach((card, i) => {
            card.classList.toggle('active', i === idx);
        });
    }

    window._calJumpToJainMonth = function (jainIdx) {
        // Map Jain month index back to approx Gregorian month
        const mapping = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        const gregMonth = mapping[jainIdx];
        // Decide which year — use current year; if month already passed, use current anyway
        let yr = currentYear;
        renderCalendar(yr, gregMonth);
        // Scroll to the calendar grid, not the top of the page
        const gridEl = document.querySelector('.cal-grid-wrapper');
        if (gridEl) {
            const offset = gridEl.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    /* ------------------------------------------------
       INIT
       ------------------------------------------------ */
    function init() {
        const now = new Date();
        renderCalendar(now.getFullYear(), now.getMonth());
        renderUpcoming();
        renderJainMonths();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
