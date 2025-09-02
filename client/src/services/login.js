// Enhanced password toggle functionality
const passwordAccess = (loginPass, button, icon) => {
  const input = document.getElementById(loginPass);
  const buttonEye = document.getElementById(button);
  const iconEye = document.getElementById(icon);

  if (!input || !buttonEye) {
    console.warn("Password toggle elements not found");
    return;
  }

  // Add keyboard accessibility
  buttonEye.setAttribute("tabindex", "0");
  buttonEye.setAttribute("role", "button");
  buttonEye.setAttribute("aria-label", "Toggle password visibility");

  const togglePassword = () => {
    const isPassword = input.type === "password";

    if (isPassword) {
      input.type = "text";
      iconEye.innerHTML = `<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>`;
      // input.value = "Lê Gia Thiên Phú";
    } else {
      input.type = "password";
      iconEye.innerHTML = `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path
                          d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                        />
                        <path
                          d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                        />
                        <line x1="2" x2="22" y1="2" y2="22" />`;
      // input.value = "••••••••";
    }

    // Update aria-label for accessibility
    buttonEye.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );

    // Visual feedback: toggle password visible class
    buttonEye.classList.toggle("password-visible");
  };

  // Click event
  buttonEye.addEventListener("click", togglePassword);

  // Keyboard event for accessibility
  buttonEye.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePassword();
    }
  });
};

// Initialize password toggle
passwordAccess("password", "loginPassword", "loginPassword-icon");
passwordAccess(
  "password-register",
  "loginPasswordRegister",
  "loginPasswordRegister-icon"
);
passwordAccess(
  "password-register-confirm",
  "loginPasswordRegisterConfirm",
  "loginPasswordRegisterConfirm-icon"
);

// Form validation and demo functionality
document.addEventListener("DOMContentLoaded", function () {
  // Prevent zoom on input focus for iOS
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });

  // Handle GO button click
  const goButton = document.getElementById("login-button");
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // chặn reload page

    // if (!validated) return;

    // Remove focus from any currently focused element
    if (document.activeElement) {
      document.activeElement.blur();
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
      // console.log(data.user);

      // alert("Login success");
    } else if (data.message === "account-not-found") {
      showRegisterPopup();
    } else if (data.message === "pending-account") {
      alert("Tài khoản chưa được kích hoạt!");
    } else if (data.message === "wrong-password") {
      alert("Sai mật khẩu!");
    } else {
      alert("Có lỗi xảy ra, thử lại sau.");
    }
  });

  // Global variables for Google authentication data
  window.googleId = null;
  window.googleEmail = null;
  window.suggestedFullName = null;
  window.AvatarLink = null;

  const registerButton = document.getElementById("register-button");
  if (registerButton) {
    registerButton.addEventListener("click", async function (e) {
      e.preventDefault();
      // if (validated) {
      // if (!form.checkValidity()) {
      //   form.reportValidity(); // hiện thông báo tooltip của browser
      //   return; // dừng nếu không hợp lệ
      // }
      console.log("Google ID:", window.googleId);
      console.log("Google Email:", window.googleEmail);
      console.log("Google Sugested Fullname: ", window.suggestedFullName);
      console.log("AvatarLink: ", window.AvatarLink);

      if (!window.AvatarLink) {
        window.AvatarLink = "https://audiox.space/preview/avatar.png";
      }

      const name = document.getElementById("username").value.trim();
      const passwordRegister = document
        .getElementById("password-register")
        .value.trim();

      const passwordConfirm = document
        .getElementById("password-register-confirm")
        .value.trim();

      // Use Google email if available, otherwise use form email
      const emailToUse =
        window.googleEmail || document.getElementById("email").value.trim();

      console.log("Registration data:", {
        email: emailToUse,
        name: name,
        passwordRegister: passwordRegister,
        passwordConfirm: passwordConfirm,
        googleId: window.googleId,
        AvatarLink: window.AvatarLink,
      });

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          password: passwordRegister,
          fullName: name,
          googleid: window.googleId,
          AvatarLink: AvatarLink,
        }),
      });

      const data = await res.json();
      // if (data.message == "not-found") {
      //   alert("Can not found the account!");
      // }

      console.log("message: ", data.message);
      console.log(data.success);

      if (data.success) {
        // Redirect to dashboard after successful registration
        window.location.href = "/dashboard"; //i comment this on purpose, dont change
      } else {
        alert("Có lỗi xảy ra, thử lại sau.");
      }
      // }
    });
  }

  // Handle Google login button click
  // const googleButton = document.querySelector(".google-login");
  // if (googleButton) {
  //   googleButton.addEventListener("click", function (e) {
  //     e.preventDefault();
  //     alert("Google OAuth integration would be implemented here!");
  //   });
  // }
});

// hiện popup đăng ký
const registerPopup = document.querySelector(".register");
const overlay = document.querySelector(".overlay");

function showRegisterPopup() {
  window.history.pushState({ dialog: "register" }, document.title, "/register");

  // First, ensure all login inputs lose focus
  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === "INPUT") {
    activeElement.blur();
  }

  const password = document.getElementById("password").value.trim();

  registerPopup.classList.add("active");
  overlay.classList.add("active");

  // Use multiple timeouts for better focus timing
  // First timeout: let animation start
  setTimeout(() => {
    const fullNameInput = document.getElementById("username");
    if (fullNameInput) {
      fullNameInput.focus();
    }
  }, 100); // Delay to let animation begin

  // Second timeout: ensure focus is truly set (backup)
  setTimeout(() => {
    const fullNameInput = document.getElementById("username");
    if (fullNameInput && document.activeElement !== fullNameInput) {
      fullNameInput.focus();
      fullNameInput.select(); // Select any existing text for better UX
    }
  }, 300); // After animation is mostly complete

  if (password) {
    document.getElementById("password-register").value = password;
  }
}

function hideRegisterPopup() {
  registerPopup.style.animation = "slideDown 0.4s ease forwards";
  overlay.classList.remove("active");

  // sau animation xong thì ẩn popup
  registerPopup.addEventListener(
    "animationend",
    () => {
      registerPopup.classList.remove("active");
      registerPopup.style.animation = ""; // reset animation
      const emailInput = document.getElementById("email");
      if (emailInput) emailInput.focus();

      if (window.location.pathname === "/register") {
        window.history.back();
        // window.history.replaceState({}, document.title, "/login");
      }
    },
    { once: true }
  );
}

overlay.addEventListener("click", hideRegisterPopup);

// --- TRAP FOCUS (1 lần khi trang load)
const focusableElements = registerPopup.querySelectorAll(
  'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstEl = focusableElements[0];
const lastEl = focusableElements[focusableElements.length - 1];

registerPopup.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      // shift + tab
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      // tab
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  } else if (e.key === "Enter") {
    // Handle Enter key press in register panel
    e.preventDefault();

    const activeElement = document.activeElement;

    // If currently focused on an input field, move to next field or submit
    if (activeElement && activeElement.tagName === "INPUT") {
      const usernameInput = document.getElementById("username");
      const passwordRegisterInput =
        document.getElementById("password-register");
      const passwordConfirmInput = document.getElementById(
        "password-register-confirm"
      );

      if (activeElement === usernameInput) {
        // Move from username to password
        passwordRegisterInput.focus();
      } else if (activeElement === passwordRegisterInput) {
        // Move from password to confirm password
        passwordConfirmInput.focus();
      } else if (activeElement === passwordConfirmInput) {
        // Submit the registration form
        const registerButton = document.getElementById("register-button");
        if (registerButton) {
          registerButton.click();
        }
      }
    } else {
      // If no input is focused, trigger register button
      const registerButton = document.getElementById("register-button");
      if (registerButton) {
        registerButton.click();
      }
    }
  }
});

// listen popstate to control dialog when user navigates history (back/forward)
window.addEventListener("popstate", (event) => {
  // if pathname is /register -> open dialog (maybe user used forward)
  if (window.location.pathname === "/register") {
    showRegisterPopup();
  } else {
    // anything else -> close dialog (eg /login)
    // closeRegisterPopup();
    hideRegisterPopup();
  }
});
