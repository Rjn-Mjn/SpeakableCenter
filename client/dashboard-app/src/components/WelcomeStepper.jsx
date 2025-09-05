import React, { useState, useRef } from "react";
import Stepper, { Step } from "../components/Stepper";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/WelcomeStepper.css";
import GenderSwitch from "../components/GenderSwitch";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/en";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Pen } from "lucide-react";
import axios from "axios";

export default function WelcomeStepper({
  className,
  isBlank,
  setIsBlank,
  currentUser,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  // const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  // const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUser.AvatarLink); // để preview ảnh
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [avatarLink, setAvatarLink] = useState("");

  function isStepValid(step) {
    if (step === 1) return true; // step 1 không có input → luôn hợp lệ
    if (step === 2) return true; //name.trim() !== ""; // step 1 không có input → luôn hợp lệ
    if (step === 3) return phone.replace(/\D/g, "").length > 9; //true; // step 2 cần nhập name
    if (step === 4) return true;
    if (step === 5) return address.trim() !== ""; //email.includes("@"); // step 3 cần nhập email
    return true;
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // tạo preview
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleUploaded = (newAvatarUrl) => {
    setPreview(newAvatarUrl); // cập nhật avatar hiển thị
  };

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first!");
    setLoading(true);

    try {
      e.preventDefault();
      if (!file) return;

      const fd = new FormData();
      fd.append("avatar", file);
      // nếu cần userId:
      fd.append("AccountID", currentUser.AccountID);

      const resp = await axios.post("https://audiox.space/upload-avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(resp.data); // { ok: true, url: 'http://27.75.93.31:5001/avatars/...' }
      // lưu url vào local state / hiển thị
      setAvatarLink(resp.data);
      handleUploaded(resp.data.avatarLink);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (isBlank) {
    return (
      <Stepper
        className={`outer-container ${className}`}
        initialStep={1}
        onStepChange={(step) => {
          setCurrentStep(step);
          console.log(step);
        }}
        onFinalStepCompleted={() => handleUpload()}
        backButtonText="Previous"
        nextButtonText="Next"
        nextButtonProps={{
          disabled: !isStepValid(currentStep),
          className: !isStepValid(currentStep) ? "next-button" : "next-button",
        }}
        isStepValid={isStepValid}
      >
        <Step>
          <h2
            style={{
              color: "black",
              fontSize: "2rem",
              lineHeight: "2rem",
              marginBottom: "0.5rem",
            }}
          >
            Welcome to
            <br />
            Speakable Center!
          </h2>

          <p style={{ color: "black" }}>
            Let’s get you set up! Just add a few more details to complete your
            profile!
          </p>
        </Step>

        <Step>
          <h2
            style={{
              color: "black",
              marginBottom: "1rem",
              lineHeight: "2rem",
              fontSize: "1.5rem",
            }}
            className="gender"
          >
            Just tell us your <span className="gender-highlight">gender</span>
            <br />
            so we can set up your profile!
          </h2>
          <GenderSwitch gender={gender} setGender={setGender}></GenderSwitch>
        </Step>

        <Step>
          <h2 style={{ color: "black", fontSize: "1.5rem" }}>
            Let's add your phone number!
          </h2>

          <PhoneInput
            country="vn"
            value={phone}
            onChange={(value) => setPhone(value)} // ✅
            className="phone-field"
          />
        </Step>

        <Step>
          <h2 style={{ color: "black", fontSize: "1.5rem" }}>
            Your birthday please! <br />
            We’d love to celebrate it with you
          </h2>
          <DatePicker value={dob} onChange={setDob} className="date-picker" />
          {/* <DatePicker
            selected={dob}
            onChange={(date) => setDob(date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
          /> */}
        </Step>

        <Step>
          <h2>What’s your address?</h2>
          <p>Don’t worry, it stays safe with us 🔒 </p>

          <div className="address-box">
            <input
              className="address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="E.g., 65 Hưng Định 07, Hưng Thọ, Thuận An, Hồ Chí Minh?"
            />
          </div>
        </Step>

        <Step>
          <h2 style={{ color: "black", fontSize: "1.5rem" }}>
            Your profile, your style! <br />
            Change avatar to fit your type.
          </h2>

          <div className="avatar-container">
            <div className="avatar-browse" onClick={handleClick}>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                style={{ position: "absolute", display: "none" }}
              />
              <div className="edit-icon">
                <Pen size={25} strokeWidth={3}></Pen>
              </div>
              {
                <div style={{ width: "100%", height: "100%" }}>
                  <img
                    src={preview}
                    alt="avatar preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              }
            </div>
          </div>
        </Step>

        <Step>
          <h2>Final Step</h2>

          <p>You made it!</p>
        </Step>
      </Stepper>
    );
  }
}
