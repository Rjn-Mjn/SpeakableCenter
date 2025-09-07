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
import uploadAvatar from "../../services/upload-avatar";
import handleSetGender from "../../services/update-gender";
import handleSetPhone from "../../services/update-phone";
import handleSetDOB from "../../services/update-dob";
import handleSetAddress from "../../services/update-address";

export default function WelcomeStepper({
  className,
  isBlank,
  // setIsBlank,
  currentUser,
  avatarUrl,
  setAvatarUrl,
  setLoading,
}) {
  // eslint-disable-next-line no-unused-vars
  const [genderBit, setGenderBit] = useState(
    Number(currentUser.Gender) // true -> 1, false -> 0
  );
  const [currentStep, setCurrentStep] = useState(0);
  // const [name, setName] = useState("");
  const [phone, setPhone] = useState(currentUser?.PhoneNumber || "");
  const [address, setAddress] = useState(currentUser?.Address || "");
  const [gender, setGender] = useState(currentUser.Gender ? "male" : "female");
  const [dob, setDob] = useState(
    currentUser?.DateOfBirth ? new Date(currentUser.DateOfBirth) : null
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    `https://audiox.space/api/avatar?url=${encodeURIComponent(avatarUrl)}`
  ); // để preview ảnh
  const fileInputRef = useRef(null);

  console.log("DOB From DB: ", dob);

  function isStepValid(step) {
    if (step === 1) return true; // step 1 không có input → luôn hợp lệ
    if (step === 2) return true; //name.trim() !== ""; // step 1 không có input → luôn hợp lệ
    if (step === 3) return phone.replace(/\D/g, "").length > 9; //true; // step 2 cần nhập name
    if (step === 4) return dob !== null;
    if (step === 5) return address.trim() !== "" || address.trim().length > 10; //email.includes("@"); // step 3 cần nhập email
    if (step === 6) return file !== ""; //email.includes("@"); // step 3 cần nhập email
    return true;
  }

  // function handleAddInfoComplete() {
  //   setTimeout(() => {
  //     setLoading(false);
  //     setIsBlank(false);
  //   }, 1000);
  // }

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

  async function handleSubmit() {
    setLoading(true);

    console.log(file);
    if (file) {
      const url = await uploadAvatar(file, currentUser.AccountID);
      console.log("Link received: ");
      setAvatarUrl(url);
    }

    console.log("Gender: ", gender);
    const bit = gender === "male" ? 1 : 0;
    setGenderBit(bit); // vẫn cập nhật state cho UI
    console.log("GenderBit: ", bit);
    await handleSetGender(bit, currentUser.AccountID); // ✅ dùng đúng giá trị

    console.log("Phone: ", phone);
    await handleSetPhone(phone, currentUser.AccountID);

    console.log("Date of birth: ", dob);
    await handleSetDOB(dob, currentUser.AccountID);

    console.log("Adrress: ", address);
    await handleSetAddress(address, currentUser.AccountID);
    // setIsBlank(false);

    // handleAddInfoComplete();
  }

  if (isBlank) {
    return (
      <Stepper
        className={`outer-container ${className}`}
        initialStep={1}
        onStepChange={(step) => {
          setCurrentStep(step);
          console.log(step);
        }}
        onFinalStepCompleted={() => handleSubmit()}
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
            // data-next-on-enter="true"
          />
        </Step>

        <Step>
          <h2 style={{ color: "black", fontSize: "1.5rem" }}>
            Your birthday please! <br />
            We’d love to celebrate it with you
          </h2>
          <DatePicker
            defaultDate={dob}
            value={dob}
            onChange={setDob}
            maxDate={new Date()}
            className="date-picker"
          />
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
                    referrerPolicy="no-referrer"
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
