import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatMenu from "../components/FloatMenu";

export default function DashboardLayout({ currentUser }) {
  return (
    <div className="layout">
      <Sidebar currentUser={currentUser} />
      <div className="main">
        <Topbar currentUser={currentUser} />
        <div className="content">
          <Outlet /> {/* render page con (Task, History, Schedule) */}
        </div>
      </div>
    </div>
  );
}
