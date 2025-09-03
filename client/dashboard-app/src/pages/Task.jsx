import React, { useState } from "react";
import Stepper, { Step } from "../components/Stepper";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Task() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function isStepValid(step) {
    if (step === 1) return true; // step 1 không có input → luôn hợp lệ
    if (step === 2) return true; // step 1 không có input → luôn hợp lệ
    if (step === 3) return name.trim() !== ""; // step 2 cần nhập name
    if (step === 4) return email.includes("@"); // step 3 cần nhập email
    return true;
  }

  return (
    <Stepper
      initialStep={1}
      onStepChange={(step) => {
        setCurrentStep(step);
        console.log(step);
      }}
      onFinalStepCompleted={() => console.log("All steps completed!")}
      backButtonText="Previous"
      nextButtonText="Next"
      nextButtonProps={{
        disabled: !isStepValid(currentStep),
        className: !isStepValid(currentStep) ? "next-button" : "next-button",
      }}
    >
      <Step>
        <h2 style={{ color: "black" }}>Welcome to the React Bits stepper!</h2>

        <p>Check out the next step!</p>
      </Step>

      <Step>
        <h2>Step 2</h2>

        <PhoneInput
          country="vn"
          value={phone}
          onChange={(value) => setPhone(value)} // ✅
        />

        {/* <img
          style={{
            height: "100px",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center -70px",
            borderRadius: "15px",
            marginTop: "1em",
          }}
          src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
        /> */}

        <p>Custom step content!</p>
      </Step>

      <Step>
        <h2>How about an input?</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name?"
        />
      </Step>

      <Step>
        <h2>Whats your email?</h2>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your name?"
        />
      </Step>

      <Step>
        <h2>Final Step</h2>

        <p>You made it!</p>
      </Step>
    </Stepper>
  );
}
