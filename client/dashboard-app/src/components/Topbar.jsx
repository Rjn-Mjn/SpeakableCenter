import React from "react";
import "../styles/Topbar.css";
import { Bell } from "lucide-react";
import FloatMenu from "./FloatMenu";

export default function Topbar({ currentUser }) {
  return (
    <nav class="navbar">
      <div class="nav-logo">
        <h1>Welcome back, dear~</h1>
        {/* <img src="../assets/Images/Logo.png" alt="Speakable Logo" /> */}
      </div>
      <FloatMenu />

      <div class="nav-links">
        <a href="#" class="nav-link notification">
          <Bell size={30} strokeWidth={2.5} />
        </a>
        <a href="#" class="nav-link profile ">
          <img
            className="avatar"
            src={currentUser.AvatarLink}
            alt=""
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <p>{currentUser.Fullname}</p>
        </a>
      </div>
    </nav>
  );
}
