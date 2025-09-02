/**
 * Smooth Scroll Polyfill for Cross-Browser Compatibility
 * Ensures smooth scrolling works on all browsers, especially older Windows browsers
 */

(function() {
  'use strict';

  // Test for smooth scroll support
  function supportsNativeSmoothScroll() {
    let supports = false;
    try {
      const div = document.createElement('div');
      div.scrollTo({
        top: 0,
        get behavior() {
          supports = true;
          return 'smooth';
        }
      });
    } catch (err) {}
    return supports;
  }

  // Only apply polyfill if native smooth scroll is not supported
  if (!supportsNativeSmoothScroll()) {
    
    // Smooth scroll implementation
    const smoothScroll = function(target, duration) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      // Easing function for smooth animation
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    };

    // Override scrollIntoView method
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) {
      if (options === undefined) {
        originalScrollIntoView.call(this);
        return;
      }
      
      if (typeof options === 'boolean') {
        originalScrollIntoView.call(this, options);
        return;
      }
      
      if (options.behavior === 'smooth') {
        smoothScroll(this, 600);
      } else {
        originalScrollIntoView.call(this, options);
      }
    };

    // Override window.scrollTo method
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(options) {
      if (arguments.length === 2) {
        originalScrollTo.call(window, arguments[0], arguments[1]);
        return;
      }
      
      if (typeof options !== 'object' || options.behavior !== 'smooth') {
        originalScrollTo.call(window, options);
        return;
      }
      
      const start = window.pageYOffset;
      const distance = (options.top || 0) - start;
      const duration = 600;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function
        const easeInOutQuad = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, start + distance * easeInOutQuad);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    };

    // Override window.scroll method
    window.scroll = window.scrollTo;
  }

  // Fix for scrollIntoView in Edge and older browsers
  if (!Element.prototype.scrollIntoViewIfNeeded) {
    Element.prototype.scrollIntoViewIfNeeded = function(centerIfNeeded) {
      centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

      const parent = this.parentNode;
      const parentComputedStyle = window.getComputedStyle(parent, null);
      const parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width'));
      const parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width'));
      const overTop = this.offsetTop - parent.offsetTop < parent.scrollTop;
      const overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight);
      const overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft;
      const overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth);

      if (centerIfNeeded) {
        if (overTop || overBottom) {
          parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
        }

        if (overLeft || overRight) {
          parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
        }
      } else {
        if (overTop) {
          parent.scrollTop = this.offsetTop - parent.offsetTop - parentBorderTopWidth;
        }

        if (overBottom) {
          parent.scrollTop = this.offsetTop - parent.offsetTop - parentBorderTopWidth - parent.clientHeight + this.clientHeight;
        }

        if (overLeft) {
          parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parentBorderLeftWidth;
        }

        if (overRight) {
          parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parentBorderLeftWidth - parent.clientWidth + this.clientWidth;
        }
      }
    };
  }

  // Polyfill for requestAnimationFrame
  (function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                                   window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  })();

})();
