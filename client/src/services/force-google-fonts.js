/**
 * Google Fonts Loading Script
 * Optimized for production - minimal console output
 */

class GoogleFontsForcer {
  constructor() {
    this.fontsLoaded = false;
    this.retryCount = 0;
    this.maxRetries = 2;
    // Only the fonts actually used in the project
    this.requiredFonts = ['Inter', 'Pacifico', 'Kalam', 'Sofia Sans Condensed'];
  }

  /**
   * Load Google Fonts efficiently
   */
  async loadGoogleFonts() {
    // Only inject the fonts we actually need
    this.injectGoogleFontsCSS();
    
    // Verify fonts loaded after a delay
    setTimeout(() => this.verifyFontsLoaded(), 2000);
  }

  /**
   * Inject Google Fonts CSS directly into the page
   */
  injectGoogleFontsCSS() {
    // Check if fonts are already loaded
    const existingFontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (existingFontLink) {
      return; // Fonts already loading
    }

    // Only load the fonts we actually use
    const fontUrl = 'https://fonts.googleapis.com/css2?' +
      'family=Inter:wght@400;500;700&' +
      'family=Pacifico&' +
      'family=Kalam:wght@300;400;700&' +
      'family=Sofia+Sans+Condensed:wght@400;700&' +
      'display=swap';

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.crossOrigin = 'anonymous';
    
    // Silent loading - no console output in production
    link.onload = () => {
      this.fontsLoaded = true;
      document.body.classList.add('fonts-loaded');
    };
    
    link.onerror = () => {
      // Silently retry with fallback
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => this.injectGoogleFontsCSS(), 1000);
      }
    };
    
    document.head.appendChild(link);
  }



  /**
   * Verify that Google Fonts actually loaded
   */
  async verifyFontsLoaded() {
    if (!('fonts' in document)) {
      return; // Silently exit if Font API not available
    }

    await document.fonts.ready;
    
    let allLoaded = true;
    for (const fontFamily of this.requiredFonts) {
      const isLoaded = document.fonts.check(`16px "${fontFamily}"`);
      if (!isLoaded) {
        allLoaded = false;
        break;
      }
    }

    if (allLoaded) {
      this.fontsLoaded = true;
      document.body.classList.add('fonts-loaded');
    } else if (this.retryCount < this.maxRetries) {
      // Silently retry
      this.retryCount++;
      setTimeout(() => this.loadGoogleFonts(), 1000);
    }
  }


  /**
   * Initialize the font loading system
   */
  init() {
    // Load fonts after a small delay to not block initial render
    setTimeout(() => this.loadGoogleFonts(), 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const fontLoader = new GoogleFontsForcer();
    fontLoader.init();
  });
} else {
  const fontLoader = new GoogleFontsForcer();
  fontLoader.init();
}
