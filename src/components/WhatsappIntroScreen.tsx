import React from "react";
import { ReactComponent as WhatsAppIntroImage } from "../assets/chats_logo.svg";
import "../css/whatsappIntroScreenStyle.css";

const WhatsappIntroScreen: React.FC = () => {
  return (
    <div className="introContainer">
      <WhatsAppIntroImage className="introImg" />
      <h1 className="introTitle unselectable">WhatsApp Web </h1>
      <div className="introSubtitle unselectable">
        <h2>
          Now send and receive messages without keeping your phone online.
          <br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </h2>
      </div>
    </div>
  );
};

export default WhatsappIntroScreen;
