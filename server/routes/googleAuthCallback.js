// routes/googleAuthCallback.js
import express from "express";
import {
  verifyGoogleIdTokenAndUpsert,
  handleGoogleCallback,
} from "../services/googleService.js";

const router = express.Router();

// Handle ID Token verification (for frontend Google Sign-In)
router.post("/", async (req, res) => {
  console.log("Received Google auth request:", req.body);

  const { id_token } = req.body;

  if (!id_token) {
    console.log("No ID token provided in request");
    return res.status(400).json({
      success: false,
      message: "No ID token provided",
    });
  }

  console.log("Processing ID token...");
  const result = await verifyGoogleIdTokenAndUpsert(id_token);
  console.log("Google auth result:", result);

  if (result.success) {
    // Set session
    req.session.user = result.user;
    console.log("Session set for user:", result.user.Email);

    return res.json({
      success: true,
      message: "Google authentication successful",
      user: {
        email: result.user.Email,
        fullName: result.user.FullName,
        id: result.user.Id,
      },
    });
  } else if (result.message == "account-not-found") {
    const googleId = result.user.googleId;
    // const googleId = null;
    console.log(googleId);

    return res.json({
      success: false,
      message: "account-not-found",
      user: {
        email: result.user.email,
        fullName: result.user.fullName,
        googleId: googleId,
      },
    });
  } else {
    console.log("Google auth failed:", result.message);
    return res.status(401).json({
      success: false,
      message: result.message,
    });
  }
});

// Handle OAuth callback (for server-side flow)
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("No authorization code received");
  }

  const redirectUri = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/google/callback`;
  const result = await handleGoogleCallback(code, redirectUri);

  if (result.success) {
    // Set session
    req.session.user = result.user;

    // Close popup and refresh parent
    res.send(`
      <html>
        <head><title>Google Login Success</title></head>
        <body>
          <script>
            // Send success message to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'google-auth-success',
                user: {
                  email: '${result.user.Email}',
                  fullName: '${result.user.FullName}',
                  id: '${result.user.Id}'
                }
              }, '*');
              window.close();
            } else {
              // Fallback: redirect to main page
              window.location.href = '/';
            }
          </script>
          <p>Login successful! This window should close automatically.</p>
        </body>
      </html>
    `);
  } else {
    res.status(401).send(`
      <html>
        <head><title>Google Login Failed</title></head>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'google-auth-error',
                message: '${result.message}'
              }, '*');
              window.close();
            }
          </script>
          <p>Authentication failed: ${result.message}</p>
        </body>
      </html>
    `);
  }
});

export default router;
