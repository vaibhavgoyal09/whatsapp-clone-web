import { useRef, useState } from "react";
import "../css/setupProfileStyle.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as CameraImg } from "../assets/camera.svg";

const SetupProfileScreen = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [imageSrc, setImageSrc] = useState("avatar.png");
  const fileInputRef = useRef();

  const maxRowCount = 4;
  const maxCharCount = 50;

  function onSubmit(e) {
    e.preventDefault();
  }

  function handleNameFieldChange(event) {
    setName(event.target.value);
  }

  function handleAboutFieldChange(event) {
    setAbout(event.target.value);
  }

  function handleFileChange(event) {
    let file = event.target.files[0];
    let imgSrc = URL.createObjectURL(file);
    setImageSrc(imgSrc);
    console.log('Handle Change called', file);
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
          <h3 className="title">Setup Your Profile</h3>
          <h4 className="subtitle">
            <span>Add your name, about and profile</span>
            <br />
            <span>photo so others can recognize you.</span>
          </h4>
          <div className="imageWrapper">
            <img
              className="stdImg"
              src={imageSrc}
              alt="profile"
            />
            <div className="cameraOverlay" onClick={() => fileInputRef.current.click()}>
              <CameraImg className="camera"/>
            </div>
          </div>
          <form onSubmit={onSubmit} className="form">
            <input type="file" onChange={handleFileChange} hidden ref={fileInputRef} accept='image/png, image/jpeg, image/jpg'/>
            <input
              type="text"
              placeholder="name"
              className="field name"
              onChange={handleNameFieldChange}
            />
            <textarea
              placeholder="about"
              className="field about"
              rows={maxRowCount}
              maxLength={maxCharCount}
              onChange={handleAboutFieldChange}
            />
            <button type="submit" className="pBtn sBtn">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupProfileScreen;
