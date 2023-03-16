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
import LoadingBar from "react-top-loading-bar";

const SignInScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();
  const auth = useAuth()!;
  const axios = useAxios()!;
  const progressStatus = axios.progressStatus;
  const sendVerificationCode = auth.sendVerificationCode;

  const form = createRef<HTMLFormElement>();

  const handlePhoneFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(event.target.value);
  };

  useEffect(() => {
    let verifier = new RecaptchaVerifier(
      "captcha-container",
      {
        size: "invisible",
      },
      FirebaseAuth
    );

    if( !recaptcha) {
      setRecaptcha(verifier);
    }

    return () => {
      verifier.clear();
    };
  }, []);

  useEffect(() => {
    if (recaptcha) {

      (window as any).recaptchaVerifier = recaptcha;

      recaptcha.render().then((widgetId: any) => {
        (window as any).recaptchaWidgetId = widgetId;
      });
    }
  }, [recaptcha]);

  const onSendOtpClicked = (e: React.FormEvent) => {
    e.preventDefault();
    sendOTP();
  };

  function sendOTP() {
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
    let trimmedPhoneNumber = phoneNumber.replace(/\s+/g, "");
    axios
      .getRequest<boolean>(
        `${WhatsApi.CHECK_USER_SIGNING_IN_URL}/${trimmedPhoneNumber}`,
        null
      )
      .then((result) => {
        console.log(result, "result")
        if (result === true) {
          auth.setUserLoggedIn();
          navigate("/");
        } else {
          navigate("/setup-profile", { state: { phoneNumber: phoneNumber } });
        }
      })
      .catch((e) => {
        setDialogVisibility(false);
        alert(e?.message);
      });
  };

  return (
    <div className="page">
      <LoadingBar color="#00a884" progress={progressStatus.progressPercent} />
      <EnterOTPDialog
        open={dialogVisibility}
        onClose={() => setDialogVisibility(false)}
        phoneNumber={phoneNumber}
        onOtpVerified={() => onOtpVerified()}
      />
      <div className="box">
        <div className="logoTitleSubtitle">
          <Logo className="logo" />
          <h1 className="appTitle">WhatsApp</h1>
          <h2 className="appSubtitle">
              Simple. Secure. Reliable messaging.</h2>
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
