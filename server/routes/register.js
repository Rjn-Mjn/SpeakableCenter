import express from "express";
import { registerUser } from "../services/authService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password, fullName, googleid, AvatarLink } = req.body;
  console.log(email + " & " + password + " & " + fullName + " & " + googleid);

  const result = await registerUser(
    email,
    password,
    fullName,
    googleid,
    AvatarLink
  );
  if (result.success) {
    const user = result.user;
    req.login(user, (err) => {
      if (err) {
        console.error("Session establishment error after registration:", err);
        return res.json({
          success: false,
          message: "Registration successful but login failed",
        });
      }

      console.log("User registered and logged in:", user.Email);
      res.json(result);
    });
  } else {
    res.json(result);
  }
});

export default router;
