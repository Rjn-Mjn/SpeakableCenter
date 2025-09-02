/**
 * loginValidate.js
 * Handles all form validation for login and registration
 * with friendly, conversational error messages
 */

(function() {
  'use strict';

  // DOM Elements
  const elements = {
    emailInput: document.getElementById("email"),
    emailError: document.getElementById("email-error"),
    passwordInput: document.getElementById("password"),
    passwordError: document.getElementById("password-error"),
    fullnameInput: document.getElementById("username"),
    fullnameError: document.getElementById("fullname-error"),
    passwordRegisterInput: document.getElementById("password-register"),
    passwordRegisterError: document.getElementById("password-error-register"),
    passwordRegisterConfirmInput: document.getElementById("password-register-confirm"),
    passwordRegisterConfirmError: document.getElementById("password-error-register-confirm"),
    loginButton: document.getElementById("login-button"),
    registerButton: document.getElementById("register-button"),
    loginForm: document.getElementById("loginForm")
  };

  // Initialize event listeners
  function init() {
    // Login button handler
    if (elements.loginButton) {
      elements.loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        // Blur any focused input
        const currentlyFocused = document.activeElement;
        if (currentlyFocused && currentlyFocused.tagName === "INPUT") {
          currentlyFocused.blur();
        }

        // Small delay to ensure blur completes
        setTimeout(() => {
          const emailValid = validateEmail();
          const passwordValid = validatePasswordLogin();

          // Trigger the form submission if validation passes
          if (emailValid && passwordValid) {
            if (elements.loginForm) {
              // Dispatch a submit event to trigger the form's submit handler
              elements.loginForm.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
              );
            }
          }
        }, 50);
      });
    }

    // Register button handler
    if (elements.registerButton) {
      elements.registerButton.addEventListener("click", async () => {
        const emailValid = validateEmail();
        const fullnameValid = validateFullname();
        const passwordValid = validatePasswordRegister();
        const confirmValid = validatePasswordConfirm();
        
        // All validations must pass for registration
        if (emailValid && fullnameValid && passwordValid && confirmValid) {
          // Trigger registration logic here
          console.log("Registration validation passed");
        }
      });
    }

    // Blur event listeners for real-time validation
    if (elements.emailInput) {
      elements.emailInput.addEventListener("blur", validateEmail);
      elements.emailInput.addEventListener("input", () => clearError(elements.emailInput, elements.emailError));
    }

    if (elements.passwordInput) {
      elements.passwordInput.addEventListener("blur", validatePasswordLogin);
      elements.passwordInput.addEventListener("input", () => clearError(elements.passwordInput, elements.passwordError));
    }

    if (elements.fullnameInput) {
      elements.fullnameInput.addEventListener("blur", validateFullname);
      elements.fullnameInput.addEventListener("input", () => clearError(elements.fullnameInput, elements.fullnameError));
    }

    if (elements.passwordRegisterInput) {
      elements.passwordRegisterInput.addEventListener("blur", validatePasswordRegister);
      elements.passwordRegisterInput.addEventListener("input", () => clearError(elements.passwordRegisterInput, elements.passwordRegisterError));
    }

    if (elements.passwordRegisterConfirmInput) {
      elements.passwordRegisterConfirmInput.addEventListener("blur", validatePasswordConfirm);
      elements.passwordRegisterConfirmInput.addEventListener("input", () => clearError(elements.passwordRegisterConfirmInput, elements.passwordRegisterConfirmError));
    }
  }

  // Validation helper functions with your custom messages
  function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (email === "") {
      return "Please share your email — we need it to reach you!";
    } else if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      return "Hmm… that doesn't look like a proper email. Try again?";
    }
    return ""; // valid
  }

  function validatePasswordLoginFormat(password) {
    if (password === "") {
      return "Don't forget your password! We can't log you in without it.";
    }
    return ""; // valid
  }

  function validateFullnameFormat(name) {
    if (!name) {
      return "Give us your full name, first & last!";
    }
    if (name.split(/\s+/).length < 2) {
      return "That's seem too short for a full name!";
    }
    if (/\d/.test(name)) {
      return "Don't put numbers in your name!";
    }
    return ""; // valid
  }

  function validatePasswordRegisterFormat(password, email, fullName) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (password === "") {
      return "We can't register you in without password!";
    }
    if (password.length < 8) {
      return "Your password is a bit too short!";
    }
    if (!(hasLetter && hasNumber && hasSymbol)) {
      return "Try mixing letters, numbers, and symbols!";
    }
    
    // Check if password contains email
    if (email) {
      const emailUsername = email.split('@')[0].toLowerCase();
      if (password.toLowerCase().includes(emailUsername)) {
        return "Password will be risky to include your email";
      }
    }
    
    // Check if password contains name
    if (fullName) {
      const names = fullName.toLowerCase().split(" ");
      for (let name of names) {
        if (name.length > 2 && password.toLowerCase().includes(name)) {
          return "Password includes your name!";
        }
      }
    }
    
    return ""; // valid
  }

  function validatePasswordConfirmFormat(password, confirmPassword) {
    if (!confirmPassword) {
      return "Please confirm your password!";
    }
    if (password !== confirmPassword) {
      return "Oops, passwords don't match. Try again!";
    }
    return ""; // valid
  }

  // Main validation functions that update the UI
  function validateEmail() {
    if (!elements.emailInput || !elements.emailError) return false;
    
    const email = elements.emailInput.value.trim();
    const errorMsg = validateEmailFormat(email);
    
    elements.emailInput.classList.toggle("active", !!errorMsg);
    elements.emailError.textContent = errorMsg;
    
    return !errorMsg; // return true if no error
  }

  function validatePasswordLogin() {
    if (!elements.passwordInput || !elements.passwordError) return false;
    
    const password = elements.passwordInput.value;
    const errorMsg = validatePasswordLoginFormat(password);
    
    elements.passwordInput.classList.toggle("active", !!errorMsg);
    elements.passwordError.textContent = errorMsg;
    
    return !errorMsg; // return true if no error
  }

  function validateFullname() {
    if (!elements.fullnameInput || !elements.fullnameError) return false;
    
    const name = elements.fullnameInput.value.trim();
    const errorMsg = validateFullnameFormat(name);
    
    elements.fullnameInput.classList.toggle("active", !!errorMsg);
    elements.fullnameError.textContent = errorMsg;
    
    return !errorMsg; // return true if no error
  }

  function validatePasswordRegister() {
    if (!elements.passwordRegisterInput || !elements.passwordRegisterError) return false;
    
    const password = elements.passwordRegisterInput.value;
    const email = elements.emailInput?.value.trim() || "";
    const name = elements.fullnameInput?.value.trim() || "";
    
    const errorMsg = validatePasswordRegisterFormat(password, email, name);
    
    elements.passwordRegisterInput.classList.toggle("active", !!errorMsg);
    elements.passwordRegisterError.textContent = errorMsg;
    
    return !errorMsg; // return true if no error
  }

  function validatePasswordConfirm() {
    if (!elements.passwordRegisterConfirmInput || !elements.passwordRegisterConfirmError) return false;
    
    const confirmPassword = elements.passwordRegisterConfirmInput.value;
    const password = elements.passwordRegisterInput?.value || "";
    
    const errorMsg = validatePasswordConfirmFormat(password, confirmPassword);
    
    elements.passwordRegisterConfirmInput.classList.toggle("active", !!errorMsg);
    elements.passwordRegisterConfirmError.textContent = errorMsg;
    
    return !errorMsg; // return true if no error
  }

  // Helper function to clear errors
  function clearError(input, errorElement) {
    if (input) {
      input.classList.remove("active");
    }
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export functions for external use if needed
  window.LoginValidation = {
    validateEmail,
    validatePasswordLogin,
    validateFullname,
    validatePasswordRegister,
    validatePasswordConfirm
  };

})();
