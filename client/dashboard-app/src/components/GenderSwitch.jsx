// import { useState } from "react";
import "../styles/GenderSwitch.css"; // import css

export default function GenderSwitch({ gender, setGender }) {
  return (
    <div className="gender-container">
      {/* Highlight */}
      <div className={`highlight ${gender}`} />

      <button
        className={`gender-btn ${gender === "male" ? "active" : ""}`}
        onClick={() => setGender("male")}
      >
        MALE
      </button>
      <button
        className={`gender-btn ${gender === "female" ? "active" : ""}`}
        onClick={() => setGender("female")}
      >
        FEMALE
      </button>
    </div>
  );
}
