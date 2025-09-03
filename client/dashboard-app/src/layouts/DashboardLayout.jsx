import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatMenu from "../components/FloatMenu";

export default function DashboardLayout({ currentUser }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isSidebarSmall, setIsSidebarSmall] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        currentUser={currentUser}
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
        isSidebarSmall={isSidebarSmall}
        setIsSidebarSmall={setIsSidebarSmall}
      />
      <div
        className={`overlay ${isSidebarActive ? "active" : ""}`}
        onClick={() => setIsSidebarActive(false)}
      ></div>
      if (currentUser.) {}
      <div className="main">
        <Topbar
          currentUser={currentUser}
          isSidebarActive={isSidebarActive}
          setIsSidebarActive={setIsSidebarActive}
        />
        <div className="content">
          <Outlet /> {/* render page con (Task, History, Schedule) */}
        </div>
      </div>
    </div>
  );
}
