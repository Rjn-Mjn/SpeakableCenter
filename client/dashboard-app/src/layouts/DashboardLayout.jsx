import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatMenu from "../components/FloatMenu";
import WelcomeStepper from "../components/WelcomeStepper";
import ClickSpark from "../components/ClickSpark";
import RandomStepSpinner from "../components/RandomStepSpinner";
// import Stepper, { Step } from "../components/Stepper";
import { DashboardContext } from "../components/DashboardContext";
import useMediaQuery from "../utils/useMediaQuery";

export default function DashboardLayout({ currentUser }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isSidebarSmall, setIsSidebarSmall] = useState(false);
  const [isBlank, setIsBlank] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.AvatarLink);
  const [loading, setLoading] = useState(false);
  const [isAccountWidthTriggered, setIsAccountWidthTriggered] = useState(false);
  const isMobile = useMediaQuery(800); // (max-width:600px)
  console.log("media query", isMobile);

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

  console.log("Do load progress: ", loading);

  return (
    <DashboardContext.Provider
      value={{
        avatarUrl,
        setAvatarUrl,
        currentUser,
        isAccountWidthTriggered,
        setIsAccountWidthTriggered,
      }}
    >
      <div className="layout">
        <RandomStepSpinner
          isLoading={loading}
          duration={2000}
          shrinkDuration={350}
          onComplete={() => {
            setLoading(false);
            setIsBlank(false);
          }}
          className="loading-info"
        ></RandomStepSpinner>
        <WelcomeStepper
          className="stepper-welcome"
          isBlank={isBlank}
          setIsBlank={setIsBlank}
          currentUser={currentUser}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          setLoading={setLoading}
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
          } ${isMobile ? "account-trigger" : ""}`}
          onClick={() => setIsSidebarActive(false)}
        ></div>
        <div className="main">
          <Topbar
            currentUser={currentUser}
            isSidebarActive={isSidebarActive}
            setIsSidebarActive={setIsSidebarActive}
            avatarUrl={avatarUrl}
          />
          <div className="content">
            <Outlet /> {/* render page con (Task, History, Schedule) */}
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
