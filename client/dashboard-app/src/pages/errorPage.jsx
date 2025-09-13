// import React, { useState } from "react";
import { useState } from "react";
import Dither from "../components/dither";
import "../styles/errorPage.css";
import TextPressure from "../components/TextPressure";
import mouth from "../assets/mouth_Nero_AI_Image_Upscaler_Photo_Face-removebg-preview.png";

export default function ErrorPage() {
  const [isAnimation, setIsAnimation] = useState(false);
  const [isMouse, setIsMouse] = useState(true);

  const toggleAnimation = () => {
    setIsAnimation((prev) => !prev);
  };
  const toggleMouse = () => {
    setIsMouse((prev) => !prev);
  };

  return (
    <div className="error-container">
      <Dither
        waveColor={[0.5, 0.5, 0.5]}
        disableAnimation={isAnimation}
        enableMouseInteraction={isMouse}
        mouseRadius={0.2}
        colorNum={4}
        waveAmplitude={0.37}
        waveFrequency={8.5}
        waveSpeed={0.04}
      />

      <div className="error-alerts">
        <div className="error-content">
          <div className="error-buttons">
            <button onClick={toggleAnimation}>
              {`Animation: ${!isAnimation ? "On" : "Off"}`}
            </button>
            <button onClick={toggleMouse}>
              {`Mouse: ${isMouse ? "On" : "Off"}`}
            </button>
          </div>
          <div className="inner">
            <h1>D*ng it!</h1>
            <h2>
              It's looks like the giant just got hungry again, <br />
              So we can't find this page at the moment.
            </h2>
          </div>
          <div className="error-bottom">
            <p>May be waiting at our homepage until we find it. Thanks!</p>
            <button>Back to Home</button>
          </div>
        </div>

        <div className="error-label">
          <h2>4</h2>
          <img src={mouth} alt="" />
          <h2>4</h2>
        </div>
      </div>
    </div>
  );
}
