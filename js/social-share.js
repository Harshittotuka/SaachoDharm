/**
 * Social Share Manager
 * Adds social sharing capabilities for bhajans with dynamic OG tags
 */

class SocialShareManager {
  constructor() {
    this.baseUrl = 'https://www.saachodharm.com';
    this.initShareButtons();
  }

  /**
   * Initialize share buttons
   */
  initShareButtons() {
    document.addEventListener('DOMContentLoaded', () => {
      this.addShareButtons();
      this.setupEventListeners();
    });
  }

  /**
   * Create and inject share buttons HTML
   */
  addShareButtons() {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'social-share-container';
    shareContainer.innerHTML = `
      <div class="share-buttons">
        <button class="share-btn share-facebook" title="Share on Facebook">
          <i class="fab fa-facebook-f"></i>
        </button>
        <button class="share-btn share-twitter" title="Share on Twitter">
          <i class="fab fa-twitter"></i>
        </button>
        <button class="share-btn share-whatsapp" title="Share on WhatsApp">
          <i class="fab fa-whatsapp"></i>
        </button>
        <button class="share-btn share-email" title="Share via Email">
          <i class="fas fa-envelope"></i>
        </button>
        <button class="share-btn share-copy" title="Copy Link">
          <i class="fas fa-link"></i>
        </button>
      </div>
    `;

    // Add CSS for share buttons if not already present
    this.injectShareButtonCSS();

    // Find a suitable place to insert share buttons
    const mainContent = document.querySelector('main') || document.querySelector('.container');
    if (mainContent) {
      mainContent.appendChild(shareContainer);
    }
  }

  /**
   * Inject CSS styles for share buttons
   */
  injectShareButtonCSS() {
    if (document.getElementById('share-buttons-css')) return;

    const css = document.createElement('style');
    css.id = 'share-buttons-css';
    css.textContent = `
      .social-share-container {
        margin: 20px 0;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 8px;
        text-align: center;
      }

      .share-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .share-btn {
        width: 45px;
        height: 45px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.3s ease;
        color: white;
      }

      .share-facebook {
        background: #1877F2;
      }

      .share-facebook:hover {
        background: #165FD8;
        transform: scale(1.1);
      }

      .share-twitter {
        background: #1DA1F2;
      }

      .share-twitter:hover {
        background: #1a91da;
        transform: scale(1.1);
      }

      .share-whatsapp {
        background: #25D366;
      }

      .share-whatsapp:hover {
        background: #20ba5b;
        transform: scale(1.1);
      }

      .share-email {
        background: #6B7280;
      }

      .share-email:hover {
        background: #4B5563;
        transform: scale(1.1);
      }

      .share-copy {
        background: #8B5CF6;
      }

      .share-copy:hover {
        background: #7C3AED;
        transform: scale(1.1);
      }

      @media (max-width: 768px) {
        .share-btn {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }

        .share-buttons {
          gap: 8px;
        }
      }
    `;
    document.head.appendChild(css);
  }

  /**
   * Setup event listeners for share buttons
   */
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.share-facebook')) {
        this.shareOnFacebook();
      } else if (e.target.closest('.share-twitter')) {
        this.shareOnTwitter();
      } else if (e.target.closest('.share-whatsapp')) {
        this.shareOnWhatsApp();
      } else if (e.target.closest('.share-email')) {
        this.shareViaEmail();
      } else if (e.target.closest('.share-copy')) {
        this.copyToClipboard();
      }
    });
  }

  /**
   * Share on Facebook
   */
  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const quote = encodeURIComponent(document.title);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }

  /**
   * Share on Twitter
   */
  shareOnTwitter() {
    const text = encodeURIComponent(document.title + ' - ' + this.baseUrl);
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=bhajans,Jainism,spirituality`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }

  /**
   * Share on WhatsApp
   */
  shareOnWhatsApp() {
    const text = encodeURIComponent(`Check out: ${document.title}\n${window.location.href}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Share via Email
   */
  shareViaEmail() {
    const subject = encodeURIComponent(document.title);
    const body = encodeURIComponent(`I found this interesting: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  /**
   * Copy current URL to clipboard
   */
  copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showNotification('Link copied to clipboard!');
    }).catch(() => {
      this.showNotification('Failed to copy link');
    });
  }

  /**
   * Show temporary notification
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Add animation for notification
   */
  static addAnimationKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Generate social meta tags for specific content
   */
  generateSocialMetaTags(title, description, imageUrl) {
    // Open Graph Meta Tags
    this.updateMetaTag('property', 'og:title', title);
    this.updateMetaTag('property', 'og:description', description);
    this.updateMetaTag('property', 'og:image', imageUrl || `${this.baseUrl}/images/default-og.jpg`);
    this.updateMetaTag('property', 'og:url', window.location.href);
    this.updateMetaTag('property', 'og:type', 'article');

    // Twitter Card Meta Tags
    this.updateMetaTag('name', 'twitter:title', title);
    this.updateMetaTag('name', 'twitter:description', description);
    this.updateMetaTag('name', 'twitter:image', imageUrl || `${this.baseUrl}/images/default-twitter.jpg`);
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:site', '@SaachoDharm');

    // LinkedIn Meta Tags
    this.updateMetaTag('property', 'linkedin:title', title);
    this.updateMetaTag('property', 'linkedin:description', description);
  }

  /**
   * Update or create meta tag
   */
  updateMetaTag(attrName, attrValue, content) {
    let tag = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);

    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
  }
}

// Initialize animations
SocialShareManager.addAnimationKeyframes();

// Initialize social share manager
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.socialShareManager = new SocialShareManager();
  });
} else {
  window.socialShareManager = new SocialShareManager();
}
