import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";
import logo from "../../src/assets/logo-icon.svg";
import logoTitle from "../../src/assets/logo-title.svg";
// import { useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Bot,
  Calendar,
  BookText,
  LibraryBig,
  CalendarCheck2,
  History,
  LogOut,
  Settings2,
  Settings,
  GraduationCap,
} from "lucide-react";
// import sidebarBottom from "../assets/sidebar-bottom.svg";

const items = [
  {
    to: "/",
    label: "Home",
    roles: ["Admin", "Students", "Moderator"],
    icon: <Home size={25} strokeWidth={2.5} />,
  },
  {
    to: "/accounts-management",
    label: "Accounts",
    roles: ["Admin", "Moderator"],
    icon: <GraduationCap size={25} strokeWidth={2.5} />,
  },
  // {
  //   to: "/task",
  //   label: "Tasks",
  //   roles: ["Admin", "Students", "Moderator"],
  //   icon: <ClipboardList size={25} strokeWidth={2.5} />,
  // },
  // {
  //   to: "/ai-feedback",
  //   label: "AI Feedback",
  //   roles: ["Admin", "Students", "Moderator"],
  //   icon: <Bot size={25} strokeWidth={2.5} />,
  // },
  // {
  //   to: "/materials",
  //   label: "Materials",
  //   roles: ["Admin", "Students", "Moderator"],
  //   icon: <LibraryBig size={25} strokeWidth={2.5} />,
  // },
  // {
  //   to: "/schedules",
  //   label: "Schedules",
  //   roles: ["Admin", "Students", "Moderator"],
  //   icon: <CalendarCheck2 size={25} strokeWidth={2.5} />,
  // },
  // {
  //   to: "/history",
  //   label: "History",
  //   roles: ["Admin", "Students", "Moderator"],
  //   icon: <History size={25} strokeWidth={2.5} />,
  // },
];

export default function Sidebar({
  currentUser,
  isSidebarActive,
  setIsSidebarActive,
  isSidebarSmall,
  setIsSidebarSmall,
}) {
  console.log(currentUser.RoleName);
  // const navigate = useNavigate();

  return (
    <aside
      className={`sidebar 
        ${isSidebarActive ? "active" : ""} 
        ${isSidebarSmall ? "small" : ""}`}
    >
      <div className="top">
        <div
          className="brand"
          onClick={() => setIsSidebarSmall((prev) => !prev)}
        >
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="logo-title">
            <img src={logoTitle} alt="" />
          </div>
        </div>
        <ul>
          {items.map((item) => {
            const access = item.roles.includes(currentUser.RoleName);
            console.log(item.roles.includes(currentUser.RoleName));

            return (
              <li key={item.to} className={!access ? "hidden" : ""}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? "nav-active" : "")}
                >
                  <span>
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bottom">
        <div className="helper">
          <h2 className="help-title">Help Center</h2>
          <div className="help-description">
            <p>Have a problem?</p>
            <p>How can we help you?</p>
          </div>
          <button class="help-btn">Contact Us</button>
        </div>
        <div className="utils">
          <button
            class="settings-btn"
            onClick={() => setIsSidebarActive(false)}
          >
            <Settings size={25} strokeWidth={2.5} />
            <span>Settings</span>
          </button>
          <form
            // class="nav-link"
            // id="logoutForm"
            action="/api/logout"
            method="POST"
          >
            <button class="logout-btn" type="submit">
              <LogOut size={25} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
