import React from "react";
import "../styles/Topbar.css";
import { Bell } from "lucide-react";
import FloatMenu from "./FloatMenu";
import { useLocation } from "react-router-dom";
import SearchAccounts from "./Search-accounts";

export default function Topbar({
  currentUser,
  isSidebarActive,
  setIsSidebarActive,
  avatarUrl,
}) {
  console.log("AvatarLink: ", avatarUrl);
  console.log("sidebar status: ", isSidebarActive);

  const location = useLocation();
  const showGreeting = ["/"].includes(location.pathname);
  const showSearchAccounts = ["/accounts-management"].includes(
    location.pathname
  );

  return (
    <nav class="navbar">
      <div class="nav-logo">
        {showGreeting && <h1>Welcome back, dear~</h1>}
        {showSearchAccounts && <SearchAccounts />}
        {/* <img src="../assets/Images/Logo.png" alt="Speakable Logo" /> */}
      </div>
      <FloatMenu
        className={isSidebarActive ? "" : "active"}
        onClick={() => setIsSidebarActive((prev) => !prev)}
      />

      <div class="nav-links">
        <a href="#" class="nav-link notification">
          <Bell size={30} strokeWidth={2.5} />
        </a>
        <a href="#" class="nav-link profile ">
          <img
            className="avatar"
            src={`https://audiox.space/api/avatar?url=${encodeURIComponent(
              avatarUrl
            )}`}
            alt=""
            referrerPolicy="no-referrer"
            // crossOrigin="anonymous"
          />
          <p>{currentUser.Fullname}</p>
        </a>
      </div>
    </nav>
  );
}
