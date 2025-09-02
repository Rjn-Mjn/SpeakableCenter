import { OAuth2Client } from "google-auth-library";
import { getUserByEmail, addUser, updateUserGoogleId } from "../models/sql.js";
import argon2 from "argon2";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID Token and create/update user in database
 * @param {string} idToken - Google ID Token
 * @returns {object} - Result with user data
 */
export async function verifyGoogleIdTokenAndUpsert(idToken) {
  try {
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const fullName = payload.name;
    const googleId = payload.sub;
    const passwordHash = await argon2.hash("SpeakableCenter");

    console.log(fullName);
    console.log(email);
    console.log(googleId);

    if (!email || !fullName) {
      return {
        success: false,
        message: "Invalid Google token: missing email or name",
      };
    }

    // Check if user already exists
    let user = await getUserByEmail(email);

    if (!user) {
      // Create new user with Google auth
      console.log("there is no such user");

      // await addUser({
      //   email: email,
      //   passwordHash: passwordHash, // No password for Google auth users
      //   fullName: fullName,
      //   status: "pending", // Google verified users are automatically active
      //   googleId: googleId,
      // });

      // // Get the newly created user
      // user = await getUserByEmail(email);
      console.log(googleId);

      return {
        success: false,
        user: {
          email: email,
          fullName: fullName,
          googleId: googleId,
        },
        message: "account-not-found",
      };
    } else {
      // Update existing user's Google ID if not set
      console.log("user have no googleid");

      if (!user.GoogleId) {
        await updateUserGoogleId(email, googleId);
        // Refresh user data
        user = await getUserByEmail(email);
      }
    }

    return {
      success: true,
      user: user,
      message: "Google authentication successful",
    };
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return {
      success: false,
      message: "Invalid Google token",
    };
  }
}

/**
 * Handle Google OAuth callback for authorization code flow
 * @param {string} code - Authorization code from Google
 * @param {string} redirectUri - The redirect URI used
 * @returns {object} - Result with user data
 */
export async function handleGoogleCallback(code, redirectUri) {
  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        success: false,
        message: `Google token exchange error: ${
          tokenData.error_description || tokenData.error
        }`,
      };
    }

    // Verify the ID token and create/update user
    return await verifyGoogleIdTokenAndUpsert(tokenData.id_token);
  } catch (error) {
    console.error("Error in Google callback:", error);
    return {
      success: false,
      message: "Google authentication failed",
    };
  }
}
