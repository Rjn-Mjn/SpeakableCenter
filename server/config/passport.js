import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  getUserByEmail,
  addUser,
  getPool,
  updateUserGoogleId,
} from "../models/sql.js";
import { getUserByID_session } from "../models/sql.js";
import { loginUser } from "../services/authService.js";
import sql from "mssql";
import argon2 from "argon2";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://audiox.space/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const googleId = profile.id;

        console.log("Google OAuth profile:", { email, fullName, googleId });

        // check user đã có trong DB chưa
        let user = await getUserByEmail(email);
        // if (!user) {
        //   // User not found - return special object to trigger registration
        //   console.log("User not found, will trigger registration popup");
        //   return done(null, {
        //     requiresRegistration: true,
        //     email: email,
        //     googleId: googleId,
        //     suggestedFullName: fullName,
        //   });
        // }
        const result = await loginUser(email, null, googleId);
        if (result.requiresRegistration) {
          console.log("User not found, will trigger registration popup");
          return done(null, false, {
            requiresRegistration: true,
            email: email,
            googleId: googleId,
            suggestedFullName: fullName,
          });
        }

        if (result.isBlocked) {
          console.log("Account blocked");
          return done(null, false, { message: "account-blocked" });
        }

        if (result.notLinked) {
          console.log("Account not linked");

          await updateUserGoogleId(email, googleId);
          user = await getUserByEmail(email);
        }

        // User exists - proceed with login
        console.log("User found, proceeding with login");
        // console.log("User object from DB:", user);

        done(null, user); // Pass user directly, not wrapped
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  try {
    console.log("SerializeUser called with:", user); //user.AccountID

    // Handle registration objects (don't serialize them)
    if (user && user.requiresRegistration) {
      console.log(
        "Serializing registration object with googleId:",
        user.googleId
      );
      return done(null, `reg_${user.googleId}`); // Prefix to identify registration
    }

    // Check if user object exists and has AccountID
    if (!user || !user.AccountID) {
      console.error("User object missing or invalid:", user);
      return done(new Error("User object missing AccountID"));
    }

    console.log("Serializing user with AccountID:", user.AccountID);
    done(null, user.AccountID);
  } catch (error) {
    console.error("Error in serializeUser:", error);
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    let user;
    console.log("DeserializeUser called with:", id, "Type:", typeof id);

    // Handle registration flow (id starts with 'reg_')
    if (typeof id === "string" && id.startsWith("reg_")) {
      const googleId = id.substring(4);
      user = { googleId: googleId, requiresRegistration: true };
      return done(null, user);
    }

    // Regular user - AccountID can be number or string
    const accountId = typeof id === "number" ? id : parseInt(id);

    if (!isNaN(accountId)) {
      // const pool = await getPool();
      // const result = await pool
      //   .request()
      //   .input("id", sql.Int, accountId)
      //   .query("SELECT * FROM Accounts WHERE AccountID = @id");
      // user = result.recordset[0];
      // console.log("user from passport: ", user);

      user = await getUserByID_session(accountId);
      console.log("user deserialized db: ", user);

      if (!user) {
        console.error("User not found for AccountID:", accountId);
        return done(null, false);
      }
    } else if (typeof id === "string") {
      // Legacy: plain googleId for registration
      user = { googleId: id, requiresRegistration: true };
    }

    done(null, user);
  } catch (error) {
    console.error("Error in deserializeUser:", error);
    done(error, null);
  }
});
