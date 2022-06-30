import React, { useRef, useState } from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";
import "./SendOtpStyle.css";
import { useAuth } from "../context/AuthContext";

const SignInScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { signInWithPhone } = useAuth();

  const form = useRef();

  const handlePhoneFieldChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const onSendOtpClicked = async (e) => {
    e.preventDefault();

    signInWithPhone(phoneNumber, "captcha-container").then(
      (confirmationResult) => {
        window.confirmationResult = confirmationResult;
        showEnterOtp();
      }
    );
  };

  function showEnterOtp() {

  }

  return (
    <div className="page">
      <div className="box">
        <div className="logoTitleSubtitle">
          <Logo className="logo" />
          <h1>
            <span className="appTitle">WhatsApp</span>
          </h1>
          <h2>
            <span className="appSubtitle">
              Simple. Secure. Reliable messaging.
            </span>
          </h2>
        </div>
        <div className="formWrapper">
          <h3 className="title">Enter Your Phone Number</h3>
          <h4 className="subtitle">
            <span>In order to use WhatsApp,</span>
            <br />
            <span>you must provide your phone number.</span>
          </h4>
          <form ref={form} onSubmit={onSendOtpClicked} className="form">
            <input
              type="text"
              placeholder="+XX XXXXXXXXXX"
              className="field"
              onChange={handlePhoneFieldChange}
            />
            <button type="submit" id="signInButton" className="sButton">
              Continue
            </button>
          </form>
        </div>
      </div>
      <div id="captcha-container" />
    </div>
  );
};

export default SignInScreen;
