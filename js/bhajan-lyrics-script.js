// Bhajan Lyrics Page Data & Functionality

// Comprehensive Bhajan data with lyrics in both languages
const bhajansLyricsData = [
    {
        id: 1,
        title: "Namokar Mantra",
        description: "The most sacred mantra in Jainism, paying homage to the five supreme beings.",
        duration: "2:30",
        youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
        audioUrl: "audio/namokar-mantra.mp3", // Replace with actual audio URL
        lyricsHindi: `नमो अरिहंताणं
नमो सिद्धाणं
नमो आयरियाणं
नमो उवज्झायाणं
नमो लोए सव्व साहूणं

एसो पंच नमोक्कारो
सव्व पावप्पणासनो
मंगलाणं च सव्वेसिं
पढमं हवई मंगलं`,
        lyricsEnglish: `Homage to the Arihants
Homage to the Siddhas
Homage to the Acharyas
Homage to the Upadhyayas
Homage to the Ascetics of the World

This five-fold salutation
Destroys all sin
And of all auspicious things
Is the foremost auspiciousness`,
        composer: "Ancient Jain Text",
        difficulty: "Easy"
    },
    {
        id: 2,
        title: "Bhaktāmara Stotra",
        description: "A devotional hymn composed by Acharya Manatunga, praising Lord Adinatha.",
        duration: "5:45",
        youtubeId: "dQw4w9WgXcQ",
        audioUrl: "audio/bhaktamara-stotra.mp3",
        lyricsHindi: `जै जिनेंद्र! जै जिनेंद्र!
भक्तामर स्तोत्र
आचार्य मनतुंग विरचित
आदिनाथ की स्तुति

भगवान् आदिनाथ की अति सुंदर कांति देखकर
भक्तों के हृदय में प्रेम उमड़ जाता है।
उनके चरणों में शरण लेने वाले
सभी प्रकार की सिद्धि को प्राप्त करते हैं।`,
        lyricsEnglish: `Hail Lord Adinatha! Hail Lord Adinatha!
The Bhaktamara Hymn
Composed by Acharya Manatunga
In praise of Lord Adinatha

Beholding the exquisite brilliance of Lord Adinatha,
Love blooms in the hearts of devotees.
Those who take refuge at His feet
Attain all spiritual accomplishments.`,
        composer: "Acharya Manatunga",
        difficulty: "Medium"
    },
    {
        id: 3,
        title: "Uvasaggaharam Stotra",
        description: "A powerful stotra for removing obstacles and achieving success.",
        duration: "4:20",
        youtubeId: "dQw4w9WgXcQ",
        audioUrl: "audio/uvasaggaharam-stotra.mp3",
        lyricsHindi: `उवसग्गहरं पासं
जस्स दुक्खं विनासई
हंतव्वं उत्तमं लोए
विण्णु कप्पाणि जीवाणि

यह स्तोत्र सभी बाधाओं को दूर करता है
और आत्मा को शुद्ध करता है।
इसका जाप करने वाले को
सभी कष्टों से मुक्ति मिलती है।`,
        lyricsEnglish: `This hymn destroys all obstacles,
And suffering is vanquished.
The most excellent practice in the world,
By which the soul finds liberation.

Chanting this stotra removes all hindrances,
And purifies the soul.
Those who recite it with devotion,
Attain freedom from all sorrows.`,
        composer: "Ancient Jain Scripture",
        difficulty: "Easy"
    },
    {
        id: 4,
        title: "Santikaram Stotra",
        description: "A peaceful hymn for inner tranquility and spiritual growth.",
        duration: "3:15",
        youtubeId: "dQw4w9WgXcQ",
        audioUrl: "audio/santikaram-stotra.mp3",
        lyricsHindi: `शांतिकरं स्तोत्र
आचार्य मनतुंग विरचित
शांति और शक्ति का स्तोत्र

हे परमेश्वर, मुझे शांति दो
सभी कष्टों से मुक्ति दिलाओ।
मेरे हृदय में प्रेम जगाओ
और आत्मा को उन्नत करो।`,
        lyricsEnglish: `Prayer for Peace
Composed by Acharya Manatunga
A hymn of peace and strength

O Supreme Lord, grant me peace,
Free me from all suffering.
Awaken love in my heart,
And elevate my soul.`,
        composer: "Acharya Manatunga",
        difficulty: "Medium"
    },
    {
        id: 5,
        title: "Kalyāṇamandira Stotra",
        description: "A beautiful hymn praising the temple of enlightenment.",
        duration: "6:10",
        youtubeId: "dQw4w9WgXcQ",
        audioUrl: "audio/kalyanamanadira-stotra.mp3",
        lyricsHindi: `कल्याणमंदिर स्तोत्र
मंदिर की स्तुति
जैन धर्म की महिमा
जै जिनेंद्र! जै जिनेंद्र!

मंदिर में देवता निवास करते हैं
और भक्तों के हृदय को आलोकित करते हैं।
इस पवित्र स्थान में आकर
हमें आध्यात्मिक शांति मिलती है।`,
        lyricsEnglish: `Hymn of the Sacred Temple
Praise of the Temple
Glory of Jain Dharma
Hail Lord Adinatha! Hail Lord Adinatha!

The temple is the abode of the divine,
Illuminating the hearts of devotees.
Coming to this sacred place,
We find spiritual tranquility.`,
        composer: "Jain Tradition",
        difficulty: "Medium"
    },
    {
        id: 6,
        title: "Tijayapahutta Stotra",
        description: "A protective stotra for overcoming fears and obstacles.",
        duration: "4:50",
        youtubeId: "dQw4w9WgXcQ",
        audioUrl: "audio/tijayapahutta-stotra.mp3",
        lyricsHindi: `तिजयपहुत्त स्तोत्र
रक्षा और शक्ति का स्तोत्र
जै जिनेंद्र! जै जिनेंद्र!

यह स्तोत्र रक्षा कवच के रूप में काम करता है
और सभी भयों को दूर करता है।
जो व्यक्ति इसका जाप करता है
वह सदा सुरक्षित रहता है।`,
        lyricsEnglish: `Protection Hymn
A hymn of defense and strength
Hail Lord Adinatha! Hail Lord Adinatha!

This stotra serves as a protective shield,
Dispelling all fears.
One who chants this prayer,
Remains forever protected.`,
        composer: "Jain Tradition",
        difficulty: "Easy"
    }
];

// DOM Elements
const youtubePlayer = document.getElementById('youtube-player');
const bhajanTitle = document.getElementById('bhajan-title');
const bhajanDescription = document.getElementById('bhajan-description');
const lyricsContent = document.getElementById('lyrics-content');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeDisplay = document.getElementById('time-display');
const volumeSlider = document.getElementById('volume-slider');
const langBtns = document.querySelectorAll('.lang-btn');
const copyBtn = document.getElementById('copy-btn');
const printBtn = document.getElementById('print-btn');
const shareBtn = document.getElementById('share-btn');
const shareModal = document.getElementById('share-modal');
const shareClose = document.querySelector('.share-close');
const suggestedBhajans = document.getElementById('suggested-bhajans');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

let currentBhajanId = 1;
let currentLanguage = 'hindi';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadBhajan(currentBhajanId);
    initializeAudioPlayer();
    initializeLanguageSwitcher();
    initializeActions();
    loadSuggestedBhajans();
});

// Navigation functionality
function initializeNavigation() {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Load Bhajan Data
function loadBhajan(bhajanId) {
    const bhajan = bhajansLyricsData.find(b => b.id === bhajanId);
    if (!bhajan) return;

    currentBhajanId = bhajanId;

    // Update title and description
    bhajanTitle.textContent = bhajan.title;
    bhajanDescription.textContent = bhajan.description;

    // Update YouTube player
    youtubePlayer.src = `https://www.youtube.com/embed/${bhajan.youtubeId}`;

    // Update audio player
    audioPlayer.src = bhajan.audioUrl;

    // Update lyrics based on current language
    updateLyrics();

    // Reset audio player
    audioPlayer.currentTime = 0;
    pauseAudio();

    // Update active suggested item
    document.querySelectorAll('.suggested-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.suggested-item[data-id="${bhajanId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Update lyrics based on language
function updateLyrics() {
    const bhajan = bhajansLyricsData.find(b => b.id === currentBhajanId);
    if (!bhajan) return;

    const lyrics = currentLanguage === 'hindi' ? bhajan.lyricsHindi : bhajan.lyricsEnglish;
    lyricsContent.textContent = lyrics;
    lyricsContent.className = `lyrics-content ${currentLanguage}`;
}

// Language Switcher
function initializeLanguageSwitcher() {
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('lang-btn-active'));
            this.classList.add('lang-btn-active');
            currentLanguage = this.getAttribute('data-lang');
            updateLyrics();
        });
    });
}

// Audio Player Controls
function initializeAudioPlayer() {
    playBtn.addEventListener('click', playAudio);
    pauseBtn.addEventListener('click', pauseAudio);
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });

    // Progress bar controls
    progressBar.addEventListener('click', function(e) {
        const width = this.clientWidth;
        const x = e.offsetX;
        const percentage = x / width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
    });

    // Update progress as audio plays
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateProgress);
}

function playAudio() {
    audioPlayer.play();
    playBtn.style.opacity = '0.5';
    pauseBtn.style.opacity = '1';
}

function pauseAudio() {
    audioPlayer.pause();
    playBtn.style.opacity = '1';
    pauseBtn.style.opacity = '0.5';
}

function updateProgress() {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percentage + '%';

        const minutes = Math.floor(audioPlayer.currentTime / 60);
        const seconds = Math.floor(audioPlayer.currentTime % 60);
        const totalMinutes = Math.floor(audioPlayer.duration / 60);
        const totalSeconds = Math.floor(audioPlayer.duration % 60);

        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} / ${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    }
}

// Action Buttons
function initializeActions() {
    // Copy Lyrics
    copyBtn.addEventListener('click', function() {
        const lyrics = lyricsContent.textContent;
        navigator.clipboard.writeText(lyrics).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    // Print
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Share
    shareBtn.addEventListener('click', openShareModal);
    shareClose.addEventListener('click', closeShareModal);
    shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
            closeShareModal();
        }
    });
}

function openShareModal() {
    shareModal.classList.add('active');
    const bhajan = bhajansLyricsData.find(b => b.id === currentBhajanId);
    const shareUrl = `${window.location.origin}${window.location.pathname}?bhajan=${currentBhajanId}`;

    document.getElementById('share-link').value = shareUrl;

    // Social sharing links
    const title = encodeURIComponent(bhajan.title);
    const text = encodeURIComponent(`Check out this beautiful Bhajan: ${bhajan.title}`);

    document.querySelector('.share-link.facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    document.querySelector('.share-link.twitter').href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    document.querySelector('.share-link.whatsapp').href = `https://wa.me/?text=${text}%20${encodeURIComponent(shareUrl)}`;
    document.querySelector('.share-link.email').href = `mailto:?subject=${title}&body=${text}%0D%0A${encodeURIComponent(shareUrl)}`;
}

function closeShareModal() {
    shareModal.classList.remove('active');
}

// Copy Share Link
document.getElementById('copy-link-btn').addEventListener('click', function() {
    const shareLink = document.getElementById('share-link');
    shareLink.select();
    navigator.clipboard.writeText(shareLink.value).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Link Copied!';
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
});

// Load Suggested Bhajans
function loadSuggestedBhajans() {
    suggestedBhajans.innerHTML = '';

    bhajansLyricsData.forEach((bhajan, index) => {
        const item = document.createElement('div');
        item.className = `suggested-item ${bhajan.id === currentBhajanId ? 'active' : ''}`;
        item.setAttribute('data-id', bhajan.id);
        item.innerHTML = `
            <div class="suggested-item-title">${bhajan.title}</div>
            <div class="suggested-item-meta">${bhajan.duration} • ${bhajan.difficulty}</div>
        `;
        item.addEventListener('click', () => {
            loadBhajan(bhajan.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        suggestedBhajans.appendChild(item);
    });
}

// Scroll to player function
function scrollToPlayer() {
    document.querySelector('.audio-player-section').scrollIntoView({ behavior: 'smooth' });
}

// Load bhajan from URL parameter if available
window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const bhajanId = parseInt(params.get('bhajan'));
    if (bhajanId && bhajansLyricsData.find(b => b.id === bhajanId)) {
        loadBhajan(bhajanId);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (audioPlayer.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    }
    if (e.key === 'Escape') {
        closeShareModal();
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target === shareModal) {
        closeShareModal();
    }
});
