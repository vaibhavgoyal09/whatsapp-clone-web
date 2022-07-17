import React, { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import EnterOTPDialog from "../components/EnterOTPDialog";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import "../css/signInScreenStyle.css";
import { WhatsApi } from "../utils/Constants";
import { auth as FirebaseAuth } from "../utils/FirebaseConfig";
import { RecaptchaVerifier } from "firebase/auth";

const SignInScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const axios = useAxios();
  const sendVerificationCode = auth?.sendVerificationCode!;

  const form = createRef<HTMLFormElement>();

  const handlePhoneFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(event.target.value);
  };

  useEffect(() => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      "captcha-container",
      {
        size: "invisible",
      },
      FirebaseAuth
    );
    (window as any).recaptchaVerifier.render().then((widgetId: any) => {
      (window as any).recaptchaWidgetId = widgetId;
    });
  }, []);

  const onSendOtpClicked = async (e: React.FormEvent) => {
    e.preventDefault();
    sendOTP();
  };

  function sendOTP() {
    console.log(phoneNumber);
    sendVerificationCode(phoneNumber)
      .then((confirmationResult) => {
        (window as any).confirmationResult = confirmationResult;
        setDialogVisibility(true);
      })
      .catch((e: any) => {
        setDialogVisibility(false);
        console.log(e);
        (window as any).recaptchaVerifier.recaptcha.reset(
          (window as any).recaptchaWidgetId
        );
      });
  }

  const onOtpVerified = () => {
    console.log(phoneNumber);
    let trimmedPhoneNumber = phoneNumber.replace(/\s+/g, "");
    axios
      ?.getRequest<boolean>(WhatsApi.CHECK_USER_SIGNING_IN_URL, {
        phone_number: trimmedPhoneNumber,
      })
      .then((_) => {
        navigate("/");
      })
      .catch((e) => {
        setDialogVisibility(false);
        alert(e?.message);
      });
  };

  return (
    <div className="page">
      <EnterOTPDialog
        open={dialogVisibility}
        onClose={() => setDialogVisibility(false)}
        phoneNumber={phoneNumber}
        onOtpVerified={() => onOtpVerified()}
      />
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
            <button type="submit" id="signInButton" className="pBtn sBtn">
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
