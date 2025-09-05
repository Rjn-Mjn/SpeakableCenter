import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatMenu from "../components/FloatMenu";
import WelcomeStepper from "../components/WelcomeStepper";
import ClickSpark from "../components/ClickSpark";
// import Stepper, { Step } from "../components/Stepper";

export default function DashboardLayout({ currentUser }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isSidebarSmall, setIsSidebarSmall] = useState(false);
  const [isBlank, setIsBlank] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const hasEmptyField = Object.values(currentUser).some((value) => {
        if (typeof value === "string") {
          return value.trim() === "";
        }
        return value === null || value === undefined;
      });
      setIsBlank(hasEmptyField);
      console.log("do user has empty: ", hasEmptyField);
      console.log(currentUser);
    }
  }, [currentUser]);

  return (
    <div className="layout">
      <WelcomeStepper
        className="stepper-welcome"
        isBlank={isBlank}
        setIsBlank={setIsBlank}
      ></WelcomeStepper>
      <Sidebar
        currentUser={currentUser}
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
        isSidebarSmall={isSidebarSmall}
        setIsSidebarSmall={setIsSidebarSmall}
      />
      <div
        className={`overlay ${isSidebarActive ? "active" : ""} ${
          isBlank ? "up" : ""
        }`}
        onClick={() => setIsSidebarActive(false)}
      ></div>
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
