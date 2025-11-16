// Lyrics page dynamic loader
let allData = [];
let currentBhajan = null;
let currentCategory = null;

// Fetch all data from JSON
async function loadLyricsData() {
    try {
        const response = await fetch('../data/jainsaar_full_data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allData = await response.json();
        console.log('✓ Data loaded:', allData.length, 'categories');
        
        // Get parameters from URL
        const params = new URLSearchParams(window.location.search);
        currentCategory = params.get('category');
        const bhajanTitle = params.get('bhajan');
        
        if (currentCategory && bhajanTitle) {
            displayBhajanLyrics(decodeURIComponent(currentCategory), decodeURIComponent(bhajanTitle));
        }
    } catch (error) {
        console.error('✗ Error loading lyrics data:', error);
        document.querySelector('.lyrics-content.hindi').innerHTML = '<p>Error loading lyrics. Please go back and try again.</p>';
    }
}

// Display the bhajan lyrics
function displayBhajanLyrics(categoryName, bhajanTitle) {
    const categoryData = allData.find(cat => cat.category === categoryName);
    
    if (!categoryData) {
        document.querySelector('.lyrics-content.hindi').innerHTML = '<p>Category not found</p>';
        return;
    }
    
    currentBhajan = categoryData.items.find(item => item.title === bhajanTitle);
    
    if (!currentBhajan) {
        document.querySelector('.lyrics-content.hindi').innerHTML = '<p>Bhajan not found in this category</p>';
        return;
    }
    
    // Update page title
    const titleElement = document.querySelector('.bhajan-main-title');
    if (titleElement) {
        const displayTitle = currentBhajan.title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        titleElement.textContent = displayTitle;
    }
    
    // Update video section - show only if video URL exists
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        if (currentBhajan.video) {
            const iframe = videoSection.querySelector('iframe');
            if (iframe) {
                iframe.src = currentBhajan.video;
            }
            videoSection.style.display = 'block';
        } else {
            videoSection.style.display = 'none';
        }
    }
    
    // Update lyrics
    const hindiLyrics = document.querySelector('.lyrics-content.hindi');
    const englishLyrics = document.querySelector('.lyrics-content.english');
    
    if (hindiLyrics) {
        hindiLyrics.innerHTML = currentBhajan.lyrics.replace(/\n/g, '<br>');
    }
    
    if (englishLyrics) {
        englishLyrics.innerHTML = 'Lyrics for ' + currentBhajan.title + ' - Original content in Devanagari script';
    }
    
    // Update suggested bhajans list
    updateSuggestedBhajans(categoryData.items);
}

// Update suggested bhajans sidebar
function updateSuggestedBhajans(bhajansList) {
    const suggestedList = document.querySelector('.suggested-list');
    if (!suggestedList) return;
    
    suggestedList.innerHTML = '';
    
    bhajansList.forEach((item, index) => {
        const isActive = item.title === currentBhajan.title ? 'active' : '';
        const displayTitle = item.title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        const suggestedItem = document.createElement('div');
        suggestedItem.className = `suggested-item ${isActive}`;
        suggestedItem.innerHTML = `
            <div class="suggested-item-title">${displayTitle}</div>
            <div class="suggested-item-meta">${(Math.random() * 3 + 2).toFixed(1)}:${Math.floor(Math.random() * 60)} • Easy</div>
        `;
        
        suggestedItem.addEventListener('click', () => {
            // Navigate to another bhajan
            const params = new URLSearchParams(window.location.search);
            const category = params.get('category');
            window.location.href = `bhajan-lyrics.html?category=${encodeURIComponent(category)}&bhajan=${encodeURIComponent(item.title)}`;
        });
        
        suggestedList.appendChild(suggestedItem);
    });
    
    // Update audio player - show only if audio file exists
    const audioPlayerSection = document.querySelector('.audio-player-section');
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayerSection && audioPlayer) {
        if (currentBhajan.audio) {
            audioPlayer.src = currentBhajan.audio;
            audioPlayerSection.style.display = 'block';
        } else {
            audioPlayerSection.style.display = 'none';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadLyricsData();
    initializeLyricsPageEvents();
});

// Initialize lyrics page events
function initializeLyricsPageEvents() {
    // Language toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            // Check if user clicked English button
            if (lang === 'english') {
                showEnglishRequestModal();
                return; // Don't switch language
            }
            
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('lang-btn-active'));
            this.classList.add('lang-btn-active');
            
            document.querySelectorAll('.lyrics-content').forEach(content => {
                content.style.display = 'none';
            });
            
            document.querySelector(`.lyrics-content.${lang}`).style.display = 'block';
        });
    });
    
    // Copy lyrics button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const lyricsText = document.querySelector('.lyrics-content:not([style*="display: none"]) .formatted-lyrics');
            if (lyricsText) {
                const text = lyricsText.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    alert('Lyrics copied to clipboard!');
                    this.textContent = '✓ Copied';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    }, 2000);
                }).catch(() => {
                    alert('Could not copy lyrics');
                });
            }
        });
    }
    
    // Print button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    const shareModal = document.getElementById('share-modal');
    if (shareBtn && shareModal) {
        shareBtn.addEventListener('click', function() {
            shareModal.style.display = 'flex';
        });
        
        document.querySelector('.share-close').addEventListener('click', function() {
            shareModal.style.display = 'none';
        });
        
        // Share link input
        const shareLink = document.getElementById('share-link');
        if (shareLink) {
            shareLink.value = window.location.href;
        }
        
        document.getElementById('copy-link-btn').addEventListener('click', function() {
            navigator.clipboard.writeText(shareLink.value).then(() => {
                alert('Link copied!');
            });
        });
    }
    
    // Audio player controls (if audio element exists)
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (audioPlayer && playBtn && pauseBtn) {
        playBtn.addEventListener('click', () => audioPlayer.play());
        pauseBtn.addEventListener('click', () => audioPlayer.pause());
    }
}

// Add styles for formatted lyrics
const style = document.createElement('style');
style.textContent = `
    .formatted-lyrics {
        line-height: 2;
        font-size: 1.1rem;
        color: #2c3e50;
        white-space: pre-wrap;
        word-wrap: break-word;
        padding: 20px;
        background: #faf8f5;
        border-radius: 10px;
        border-left: 4px solid #ff6b35;
    }

    /* Beautiful English Request Modal */
    .english-request-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-in-out;
    }

    .english-request-modal.active {
        display: flex;
    }

    .english-request-content {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
        animation: slideUp 0.4s ease-out;
        border: 2px solid #ff6b35;
    }

    .english-request-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: bounce 1s infinite;
    }

    .english-request-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 15px;
        font-family: 'Merriweather', serif;
    }

    .english-request-text {
        font-size: 1rem;
        color: #555;
        line-height: 1.6;
        margin-bottom: 30px;
    }

    .english-request-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
    }

    .english-request-btn {
        padding: 12px 25px;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .english-request-btn-primary {
        background: #ff6b35;
        color: white;
    }

    .english-request-btn-primary:hover {
        background: #e55a24;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(255, 107, 53, 0.3);
    }

    .english-request-btn-secondary {
        background: #f0f0f0;
        color: #2c3e50;
    }

    .english-request-btn-secondary:hover {
        background: #e0e0e0;
        transform: translateY(-2px);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Beautiful English Request Modal Function
function showEnglishRequestModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('english-request-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'english-request-modal';
        modal.className = 'english-request-modal';
        modal.innerHTML = `
            <div class="english-request-content">
                <div class="english-request-icon">🌍</div>
                <h2 class="english-request-title">English Translation Coming Soon</h2>
                <p class="english-request-text">
                    English translations are not available right now. We're working hard to bring them to you soon!
                </p>
                <p class="english-request-text" style="font-size: 0.9rem; color: #777;">
                    If you'd like to request English translations, please let us know.
                </p>
                <div class="english-request-buttons">
                    <button class="english-request-btn english-request-btn-primary" onclick="window.location.href='contact.html'">
                        Request Translation
                    </button>
                    <button class="english-request-btn english-request-btn-secondary" onclick="closeEnglishRequestModal()">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
}

// Close English Request Modal
function closeEnglishRequestModal() {
    const modal = document.getElementById('english-request-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}
