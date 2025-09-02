import express from "express";
import { loginUser } from "../services/authService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  if (result.success) {
    const user = result.user;
    req.login(user, (err) => {
      if (err) {
        console.error("Session establishment error:", err);
        return res.json({ success: false, message: "Session creation failed" });
      }

      // Now the user is authenticated and req.isAuthenticated() will return true
      console.log("User logged in and session established:", user.Email);
      res.json(result);
    });
  } else {
    // Login failed, just return the error result
    res.json(result);
  }
});

export default router;
