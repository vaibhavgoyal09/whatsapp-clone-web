import React, { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import "../css/otpDialogStyle.css";

interface Props {
  open: boolean;
  phoneNumber: string;
  onClose: () => void;
  onOtpVerified: () => void;
}

const EnterOTPDialog: React.FC<Props> = ({
  open,
  phoneNumber,
  onClose,
  onOtpVerified,
}) => {
  const [otp, setOtp] = useState("");
  const auth = useAuth();

  const handleSubmitOtp = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    auth?.verifyOtpAndSignInUser(otp)
      .then((_: any) => {
        onOtpVerified();
      })
      .catch((e: any) => {
        console.log(e.message);
        (window as any).recaptchaVerifier.recaptcha.reset(
          (window as any).recaptchaWidgetId
        );
        onClose();
      });
  }, [otp]);

  if (!open) {
    return null;
  }

  function handleOtpFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOtp(event.target.value);
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
