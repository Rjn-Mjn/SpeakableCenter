import bcrypt from "bcrypt";
import { getUserByUsername } from "../models/sql.js";
import argon2 from "argon2";
import { getUserByEmail, addUser, getUserByGoogleId } from "../models/sql.js";

/* ============================================================================
   LOGIN
   ============================================================================ */
export async function loginUser(email, password, googleId) {
  const user = await getUserByEmail(email);
  console.log(user);

  if (!user)
    return {
      success: false,
      message: "account-not-found",
      requiresRegistration: true,
    };
  //   if (!user) return { succes: false, message: "not-found" };

  if (!googleId) {
    const valid = await argon2.verify(user.PasswordHash, password);
    if (!valid) {
      return {
        success: false,
        message: "wrong-password",
        isAuthenticated: false,
      };
    }
  }

  if (!user.GoogleID) {
    return { success: true, message: "account-not-linked", notLinked: true };
  }

  // Allow pending users to login but with restricted access
  if (user.Status == "pending") {
    return {
      success: true,
      message: "pending-account",
      fullName: user.FullName,
      user: user,
      isPending: true, // Flag to indicate limited access
    };
  }

  if (user.Status == "blocked") {
    return { success: false, message: "blocked-account", isBlocked: true };
  }

  return {
    success: true,
    message: "Login thành công!",
    fullName: user.FullName,
    user: user, // Return the full user object for session
  };
}

/* ============================================================================
   REGISTER
   ============================================================================ */
export async function registerUser(email, password, fullName, googleid) {
  if (!email || !password || !fullName) {
    return { success: false, message: "Thiếu thông tin đăng ký" };
  }

  // check email đã tồn tại chưa
  let user = await getUserByEmail(email);
  if (user) {
    return { success: false, message: "Email đã được đăng ký" };
  }

  // hash password bằng argon2
  const passwordHash = await argon2.hash(password);

  // thêm user vào DB với status = pending
  console.log("registering with google id: " + googleid);
  await addUser({
    email,
    passwordHash,
    fullName,
    status: "pending",
    googleId: googleid, // Use googleId (uppercase I) to match the database function
  });
  user = await getUserByEmail(email);

  return {
    success: true,
    message: "register-success",
    user: user,
  };
}
