import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import '../css/otpDialogStyle.css';

const EnterOTPDialog = ({
    open,
  phoneNumber,
  onClose,
  onOtpVerified,
}) => {
  const [otp, setOtp] = useState("");
  const { verifyOtpAndSignInUser } = useAuth();

  if(!open) {
      return null;
  }

  function handleSubmitOtp(e) {
    if (e !== null) {
      e.preventDefault();
    }
    verifyOtpAndSignInUser(otp)
      .then((_) => {
        onOtpVerified();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleOtpFieldChange(event) {
    setOtp(event.target.value);
    if (otp.length === 6) {
      handleSubmitOtp(null);
    }
  }

  return (
    <div className="overlay" onClick={() => onClose()}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="title">Enter The 6-digit Code</h3>
        <h4 className="subtitle">
          <span>Enter the OTP sent to </span>
          <br />
          <span>{phoneNumber}.</span>
        </h4>
        <form onSubmit={handleSubmitOtp} className="form">
          <input
            type="text"
            placeholder="OTP"
            className="field"
            onChange={handleOtpFieldChange}
          />
          <button type="submit" id="signInButton" className="pBtn sBtn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterOTPDialog;
