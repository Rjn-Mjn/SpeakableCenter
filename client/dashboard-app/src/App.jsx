// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Task from "./pages/Task";
import Schedule from "./pages/Schedule";
import SplitText from "./components/SplitText";
import BlurText from "./components/BlurText";
import AnimatedContent from "./components/AnimatedContent";
import DashboardLayout from "./layouts/DashboardLayout";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import avatar from "../../public/preview/avatar.png";

import "./App.css";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [user, setUser] = useState(null);
  const letters = "Welcome to Speakable Center!";

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((user) => {
        setUser(user);
        console.log(user);

        console.log("Current role:", user.RoleName);
      })
      .catch((err) => {
        console.error(err);
        const user = {
          AccountID: 21,
          Email: "phulgttv00172@gmail.com",
          Fullname: "Peter Lovwood",
          GoogleID: "114097638083625117178",
          PhoneNumber: null,
          RoleName: "Students",
          Status: "active",
          AvatarLink:
            "https://lh3.googleusercontent.com/a/ACg8ocK7gc3KzJcXRYKRFXdq1YkayTOAX4mP-RUa1CQRUURAMv1ZhyhU=s96-c",
          DOC: "", //"2025-09-2",
          DateOfBirth: "", //"2008-08-21",
          Gender: "", //1,
          Address: "", //"abcxyz",
        };
        console.log(user);

        setUser(user); // nếu chưa login thì để null
      });
    // .finally(() => setShowWelcome(false));
  }, []);

  function handleAnimationComplete() {
    setTimeout(() => {
      setShowWelcome(false);
      setShowMain(true);
    }, 1000);
  }

  if (!user) {
    console.log("Can not get user");
  }

  if (showWelcome) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "2rem",
          padding: "1rem",
        }}
        className="welcome-box"
      >
        <BlurText
          text={letters}
          delay={100}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-2xl mb-8 welcome-text"
        />
      </div>
    );
  }

  if (showMain) {
    // return <Dashboard />;
    // return Dashboard();
    return (
      <AnimatedContent
        className="main"
        distance={160}
        direction="vertical"
        reverse={false}
        duration={0.7}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        initialScale={0.1}
        scale={0.1}
        threshold={0.2}
        delay={0}
      >
        <Routes>
          <Route path="/" element={<DashboardLayout currentUser={user} />}>
            <Route index element={<Dashboard currentUser={user} />} />
            <Route path="task" element={<Task />} />
            <Route path="ai-feedback" element={<History />} />
            <Route path="materials" element={<Schedule />} />
            <Route path="schedules" element={<Schedule />} />
            <Route path="history" element={<Schedule />} />
          </Route>
        </Routes>
      </AnimatedContent>
    );
  }
}

export default App;
