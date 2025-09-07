// import React, { useState } from "react";
import Stepper, { Step } from "../components/Stepper";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import "../styles/InfoBar.css";
import { Pencil } from "lucide-react";
import AvatarWithBorder from "./AvatarWithBorder";
import Greeting from "./Greating";

export default function InfoBar({ FullName, avatarUrl }) {
  console.log(FullName);

  const avatar = `https://audiox.space/api/avatar?url=${encodeURIComponent(
    avatarUrl
  )}`;
  return (
    <aside className="info-bar">
      <div className="top">
        <div className="edit-avatar">
          <Pencil />
        </div>
        <div className="personal">
          <a href="#">
            <AvatarWithBorder
              src={avatar}
              size={192}
              imageScale={0.85}
              hoverScale={1.1}
              transition="0.4s"
            />
          </a>

          <h2> {FullName} </h2>
        </div>
        <div className="quote">
          <Greeting />
          <p>Even a 1% improvement today is a step forward.</p>
        </div>
      </div>
      <div className="bottom"></div>
    </aside>
  );
}
