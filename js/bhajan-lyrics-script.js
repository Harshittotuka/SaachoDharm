// Bhajan Lyrics Page - Static Functionality Only

// DOM Elements
const langBtns = document.querySelectorAll('.lang-btn');
const lyricsContent = document.querySelectorAll('.lyrics-content');
const copyBtn = document.getElementById('copy-btn');
const printBtn = document.getElementById('print-btn');
const shareBtn = document.getElementById('share-btn');
const shareModal = document.getElementById('share-modal');
const shareClose = document.querySelector('.share-close');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeDisplay = document.getElementById('time-display');
const volumeSlider = document.getElementById('volume-slider');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

let currentLanguage = 'hindi';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLanguageSwitcher();
    initializeAudioPlayer();
    initializeActions();
});

// Navigation
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

// Language Switcher
function initializeLanguageSwitcher() {
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('lang-btn-active'));
            this.classList.add('lang-btn-active');
            currentLanguage = this.getAttribute('data-lang');
            
            // Show/hide lyrics based on language
            lyricsContent.forEach(lyric => {
                lyric.style.display = lyric.classList.contains(currentLanguage) ? 'block' : 'none';
            });
        });
    });
}

// Audio Player
function initializeAudioPlayer() {
    playBtn.addEventListener('click', playAudio);
    pauseBtn.addEventListener('click', pauseAudio);
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });

    progressBar.addEventListener('click', function(e) {
        const width = this.clientWidth;
        const x = e.offsetX;
        const percentage = x / width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
    });

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

// Actions
function initializeActions() {
    // Copy Lyrics
    copyBtn.addEventListener('click', function() {
        const lyrics = Array.from(document.querySelectorAll('.lyrics-content')).find(el => el.style.display !== 'none').textContent;
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

// Scroll to player
function scrollToPlayer() {
    document.querySelector('.audio-player-section').scrollIntoView({ behavior: 'smooth' });
}

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
