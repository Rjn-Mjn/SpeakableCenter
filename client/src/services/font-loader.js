/**
 * Font Loading Detection and Fallback System
 * Ensures fonts load reliably across all devices
 * With special handling for audiox.space domain
 */

class FontLoader {
  constructor() {
    this.fontsToLoad = [
      'Inter',
      'Pacifico',
      'Source Serif Pro',
      'Kalam',
      'Akshar',
      'Archivo Black',
      'Gasoek One',
      'Shrikhand',
      'Syncopate',
      'Tilt Warp',
      'Sofia Sans Condensed'
    ];
    this.loadTimeout = 8000; // 8 seconds timeout for better Google Fonts loading
    this.fallbackApplied = false;
    this.currentOS = this.detectOS();
  }

  /**
   * Detect the user's operating system
   */
  detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    if (userAgent.includes('win') || platform.includes('win')) {
      return 'windows';
    } else if (userAgent.includes('mac') || platform.includes('mac') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'macos';
    } else if (userAgent.includes('linux') || userAgent.includes('x11') || userAgent.includes('ubuntu') || userAgent.includes('fedora')) {
      return 'linux';
    } else {
      return 'unknown';
    }
  }

  /**
   * Apply OS-specific styles
   */
  applyOSStyles() {
    document.body.classList.add(`platform-${this.currentOS}`);
    console.log(`🖥️ Detected OS: ${this.currentOS}`);
    
    // Load cross-platform CSS
    const crossPlatformLink = document.createElement('link');
    crossPlatformLink.rel = 'stylesheet';
    crossPlatformLink.href = '/styles/fonts-cross-platform.css';
    document.head.appendChild(crossPlatformLink);
  }

  /**
   * Check if a font is loaded using Font Loading API
   */
  async checkFontLoaded(fontFamily) {
    if (!('fonts' in document)) {
      return false; // Font Loading API not supported
    }

    try {
      // Check if font is already loaded
      const loaded = document.fonts.check(`16px "${fontFamily}"`);
      if (loaded) return true;

      // Try to load the font
      await document.fonts.load(`16px "${fontFamily}"`);
      return document.fonts.check(`16px "${fontFamily}"`);
    } catch (error) {
      console.warn(`Font loading failed for ${fontFamily}:`, error);
      return false;
    }
  }

  /**
   * Fallback method using canvas text measurement
   */
  checkFontLoadedCanvas(fontFamily) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Test text
    const testText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    // Measure with fallback font
    context.font = '16px monospace';
    const fallbackWidth = context.measureText(testText).width;
    
    // Measure with target font + fallback
    context.font = `16px "${fontFamily}", monospace`;
    const targetWidth = context.measureText(testText).width;
    
    // If widths are different, the font loaded
    return Math.abs(targetWidth - fallbackWidth) > 1;
  }

  /**
   * Apply local font fallbacks when Google Fonts fail
   */
  applyFontFallbacks() {
    if (this.fallbackApplied) return;
    
    const style = document.createElement('style');
    style.textContent = `
      /* Emergency LOCAL font fallbacks - fonts from your own domain */
      :root {
        --font-inter: "Inter-Local", ui-sans-serif, system-ui, -apple-system, 
                      BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
        --font-pacifico: "Pacifico-Local", "Brush Script MT", "Lucida Handwriting", 
                          cursive !important;
        --font-source-serif: ui-serif, Georgia, "Times New Roman", serif !important;
        --font-kalam: "Comic Sans MS", "Chalkduster", "Bradley Hand", cursive !important;
        --font-akshar: ui-sans-serif, Arial, sans-serif !important;
        --font-archivo-black: "Arial Black", Helvetica, sans-serif !important;
        --font-gasoek: Impact, "Arial Black", sans-serif !important;
        --font-shrikhand: "Brush Script MT", cursive !important;
        --font-syncopate: "Courier New", monospace !important;
        --font-tilt-warp: ui-sans-serif, Arial, sans-serif !important;
        --font-sofia-condensed: "Arial Narrow", "Helvetica Condensed", sans-serif !important;
      }
      
      /* Force local fonts on problematic elements */
      .font-inter, [style*="font-family: Inter"] {
        font-family: "Inter-Local", ui-sans-serif, system-ui, sans-serif !important;
      }
      
      .font-pacifico, [style*="font-family: Pacifico"], .welcome-title {
        font-family: "Pacifico-Local", "Brush Script MT", cursive !important;
      }
      
      /* Mark body for CSS targeting */
      body {
        --fonts-status: 'local-fallback';
      }
    `;
    
    document.head.appendChild(style);
    this.fallbackApplied = true;
    document.body.classList.add('fonts-using-local');
    console.warn('✅ Local font fallbacks applied - fonts now served from audiox.space');
  }

  /**
   * Immediately apply local fonts (don't wait for Google Fonts to fail)
   */
  applyImmediateLocalFonts() {
    const style = document.createElement('style');
    style.id = 'immediate-local-fonts';
    style.textContent = `
      /* Immediate local font availability */
      .font-local-ready {
        --font-inter: "Inter-Local", var(--font-inter) !important;
        --font-pacifico: "Pacifico-Local", var(--font-pacifico) !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('font-local-ready');
    console.log('✅ Local fonts available immediately as fallback');
  }

  /**
   * Check network connectivity
   */
  async checkNetworkConnectivity() {
    try {
      // Special handling for the production domain
      if (this.isLiveDomain()) {
        // Use a more reliable endpoint that works with CSP and mixed content restrictions
        const response = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          credentials: 'omit',  // Don't send cookies for better privacy
          signal: AbortSignal.timeout(2000)
        });
        return true;
      } else {
        // Standard check for local development
        const response = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: AbortSignal.timeout(2000)
        });
        return true;
      }
    } catch (error) {
      console.warn('Google Fonts connectivity check failed:', error);
      return false;
    }
  }

  /**
   * Check if we're on the live domain
   */
  isLiveDomain() {
    return window.location.hostname === 'audiox.space' || 
           window.location.hostname.endsWith('.audiox.space');
  }

  /**
   * Add domain-specific CSS for production
   */
  addDomainSpecificStyles() {
    if (this.isLiveDomain()) {
      // Add secure fonts CSS for the live domain
      const secureLink = document.createElement('link');
      secureLink.rel = 'stylesheet';
      secureLink.href = '/styles/fonts-secure.css';
      document.head.appendChild(secureLink);
      
      console.log('Added domain-specific font styles for audiox.space');
    }
  }

  /**
   * Initialize font loading with detection and fallbacks
   */
  async init() {
    // Apply OS-specific styles first
    this.applyOSStyles();
    
    // Add domain-specific styles if needed
    this.addDomainSpecificStyles();
    
    // Add loading class to body
    document.body.classList.add('fonts-loading');
    
    try {
      // Check network connectivity first
      const hasConnectivity = await this.checkNetworkConnectivity();
      
      if (!hasConnectivity) {
        console.warn('No connectivity to Google Fonts, applying fallbacks');
        this.applyFontFallbacks();
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-fallback');
        return;
      }

      // Wait for fonts to load or timeout
      const fontPromises = this.fontsToLoad.map(async (font) => {
        try {
          const loaded = await Promise.race([
            this.checkFontLoaded(font),
            new Promise(resolve => setTimeout(() => resolve(false), this.loadTimeout))
          ]);
          
          if (!loaded) {
            // Try canvas method as fallback
            const canvasLoaded = this.checkFontLoadedCanvas(font);
            if (!canvasLoaded) {
              console.warn(`Font not loaded: ${font}`);
              return false;
            }
          }
          return true;
        } catch (error) {
          console.warn(`Font loading error for ${font}:`, error);
          return false;
        }
      });

      const results = await Promise.all(fontPromises);
      const failedFonts = results.filter(result => !result);

      // Only apply fallbacks if MOST fonts failed (be more lenient)
      if (failedFonts.length > Math.floor(this.fontsToLoad.length * 0.7)) {
        console.warn(`Only ${this.fontsToLoad.length - failedFonts.length}/${this.fontsToLoad.length} fonts loaded, applying selective fallbacks`);
        this.applyFontFallbacks();
        document.body.classList.add('fonts-fallback');
      } else {
        console.log(`✅ Google Fonts loaded successfully: ${this.fontsToLoad.length - failedFonts.length}/${this.fontsToLoad.length}`);
        document.body.classList.add('fonts-loaded');
      }

    } catch (error) {
      console.error('Font loading system error:', error);
      this.applyFontFallbacks();
      document.body.classList.add('fonts-fallback');
    } finally {
      document.body.classList.remove('fonts-loading');
    }
  }

  /**
   * Retry font loading
   */
  async retry() {
    console.log('Retrying font loading...');
    this.fallbackApplied = false;
    document.body.className = document.body.className.replace(/fonts-(loaded|fallback|loading)/g, '');
    await this.init();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const fontLoader = new FontLoader();
    fontLoader.init();
  });
} else {
  const fontLoader = new FontLoader();
  fontLoader.init();
}

// Make fontLoader available globally for debugging
window.fontLoader = new FontLoader();

// Add CSS for loading states
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  /* Font loading states */
  .fonts-loading {
    visibility: hidden;
  }
  
  .fonts-loading * {
    visibility: visible;
  }
  
  .fonts-loaded {
    /* Font loading completed successfully */
  }
  
  .fonts-fallback {
    /* Using fallback fonts */
  }
  
  /* Smooth transition when fonts load */
  body.fonts-loading {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  body.fonts-loaded,
  body.fonts-fallback {
    opacity: 1;
  }
`;

document.head.appendChild(loadingStyles);
