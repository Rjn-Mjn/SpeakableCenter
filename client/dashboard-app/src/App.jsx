// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import History from "./pages/History";
import SplitText from "./components/SplitText";
import BlurText from "./components/BlurText";
import AnimatedContent from "./components/AnimatedContent";
import { useState } from "react";

import "./App.css";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const letters = "Welcome to Speakable Center!";

  function handleAnimationComplete() {
    setTimeout(() => {
      setShowWelcome(false);
      setShowMain(true);
    }, 1000);
  }

  if (showWelcome) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
        }}
      >
        <BlurText
          text={letters}
          delay={100}
          animateBy="chars"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-2xl mb-8"
        />
      </div>
    );
  }
  if (showMain) {
    return <Dashboard />;
    // return Dashboard();
  }
}

export default App;
