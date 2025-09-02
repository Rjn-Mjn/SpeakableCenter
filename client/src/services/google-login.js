let googleClientId = null;

async function initGoogle() {
  try {
    const r = await fetch("/api/config");
    const config = await r.json();
    googleClientId = config.googleClientId;

    // console.log("Google Client ID loaded:", googleClientId);
  } catch (error) {
    console.error("Error loading Google config:", error);
  }
}

/**
 * Open Google OAuth2 authorization in same tab
 */
function openGoogleOAuth() {
  if (!googleClientId) {
    console.error("Google Client ID not loaded");
    alert("Google authentication is not configured. Please refresh the page.");
    return;
  }

  // Store current page URL to return after authentication
  sessionStorage.setItem("oauth_return_url", window.location.href);

  // Build OAuth2 authorization URL
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.append("client_id", googleClientId);
  authUrl.searchParams.append(
    "redirect_uri",
    "https://audiox.space/auth/google/callback"
  );
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", "profile email");
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("prompt", "select_account");

  console.log("Redirecting to Google OAuth in same tab:", authUrl.toString());

  // Navigate to Google OAuth in the same tab
  window.location.href = authUrl.toString();
}

/**
 * Check URL parameters and handle OAuth return
 */
async function handleOAuthReturn() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("registration_required")) {
    console.log("Registration required, fetching Google auth data");

    try {
      const response = await fetch("/api/auth/google/pending");
      const result = await response.json();

      if (result.success) {
        // Store Google data for registration
        window.googleEmail = result.data.email;
        window.googleId = result.data.googleId;
        window.suggestedFullName = result.data.suggestedFullName;

        console.log("Google auth data loaded for registration:", {
          email: window.googleEmail,
          googleId: window.googleId,
          suggestedFullName: window.suggestedFullName,
        });

        // Clean URL
        window.history.replaceState({}, document.title, "/login");

        // Show registration popup
        showRegisterPopup();

        if (window.suggestedFullName) {
          document.getElementById("username").value = window.suggestedFullName;
        }
      }
    } catch (error) {
      console.error("Error fetching pending Google auth data:", error);
    }
  } else if (urlParams.has("error")) {
    const error = urlParams.get("error");
    console.log("OAuth error:", error);
    alert("Google authentication failed. Please try again.");

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// Initialize Google OAuth2 and setup event listeners
window.addEventListener("load", function () {
  // Load Google configuration
  initGoogle();

  // Handle OAuth return (registration or error)
  handleOAuthReturn();

  // Setup OAuth2 same-tab flow for Google login button
  const btn = document.getElementById("myGoogleBtn");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Google OAuth2 button clicked");
      openGoogleOAuth();
    });
  } else {
    console.error("myGoogleBtn element not found");
  }
});
