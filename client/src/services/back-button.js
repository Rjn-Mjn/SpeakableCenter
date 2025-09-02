/**
 * Back Button Handler
 * Ensures the back button works reliably on the login page
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initBackButton() {
        // Try multiple selectors for the back button
        const backButton = document.querySelector('.back-button') || 
                          document.querySelector('[aria-label="Go back"]') ||
                          document.querySelector('#back')?.parentElement;
        
        if (backButton) {
            // Remove any existing onclick to avoid conflicts
            backButton.onclick = null;
            
            // Add event listener
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Multiple navigation methods for compatibility
                try {
                    // Method 1: Using location.href
                    window.location.href = '/';
                } catch (error1) {
                    try {
                        // Method 2: Using location.assign
                        window.location.assign('/');
                    } catch (error2) {
                        try {
                            // Method 3: Using location.replace (no back history)
                            window.location.replace('/');
                        } catch (error3) {
                            // Method 4: Using anchor tag simulation
                            const link = document.createElement('a');
                            link.href = '/';
                            link.click();
                        }
                    }
                }
            });
            
            // Also handle Enter key for accessibility
            backButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Visual feedback
            backButton.style.cursor = 'pointer';
            
            // Add hover effect if not already styled
            backButton.addEventListener('mouseenter', function() {
                this.style.opacity = '0.8';
            });
            
            backButton.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
            });
            
            console.log('✅ Back button handler initialized');
        } else {
            console.warn('Back button not found on page');
        }
        
        // Also make the logo clickable as a backup
        const logo = document.querySelector('#Logo');
        if (logo && !logo.parentElement.matches('a')) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', function() {
                window.location.href = '/';
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackButton);
    } else {
        // DOM is already ready
        initBackButton();
    }
    
    // Also try after a short delay in case of dynamic content
    setTimeout(initBackButton, 100);
    
})();
