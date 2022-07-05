import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import EnterOTPDialog from "../components/EnterOTPDialog";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import "../css/signInScreenStyle.css";

const SignInScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const navigate = useNavigate();
  const { sendVerificationCode } = useAuth();
  const { checkIfUserExists } = useAxios();

  const form = useRef();

  const handlePhoneFieldChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const onSendOtpClicked = async (e) => {
    e.preventDefault();

    sendVerificationCode(phoneNumber, "captcha-container").then(
      (confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setDialogVisibility(true);
      }
    );
  };

  const onOtpVerified = () => {
    console.log(phoneNumber);
    let trimmedPhoneNumber = phoneNumber.replace(/\s+/g, '');
    checkIfUserExists(trimmedPhoneNumber)
      .then((result) => {
        navigate("/", { state: { user: result } });
      })
      .catch((e) => {
        console.log(e);
        navigate("/setup-profile", { state: { phoneNumber: phoneNumber } });
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
