import React, { createRef, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { ReactComponent as CameraImg } from "../assets/camera.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import "../css/setupProfileStyle.css";
import CreateUserRequest from "../models/CreateUserRequest";
import { WhatsApi } from "../utils/Constants";

interface SetupProfileScreenState {
  phoneNumber: string;
}

const SetupProfileScreen = () => {
  const [name, setName] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>("avatar.png");
  const [image, setImage] = useState<File | null>(null);
  const location = useLocation();
  const fileInputRef = createRef<HTMLInputElement>();
  const navigate = useNavigate();
  const auth = useAuth();
  const axios = useAxios();
  const state = location.state as SetupProfileScreenState;
  const { phoneNumber } = state;
  const progressStatus  = axios!.progressStatus;

  const maxRowCount = 4;
  const maxCharCount = 50;

  function handleNameFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleAboutFieldChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setAbout(event.target.value);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    let file = event.target.files ? event.target.files[0] : null;

    if (file) {
      let imgSrc = URL.createObjectURL(file);
      setImageSrc(imgSrc);
      setImage(file);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (image) {
      axios!
        .uploadFile(image)
        .then((result) => {
          registerUser(result);
        })
        .catch((e: any) => {
          console.log(e.message);
        });
    } else {
      registerUser(null);
    }
  }

  function registerUser(profileImageUrl: string | null) {
    let request: CreateUserRequest = {
      name: name,
      about: about,
      phone_number: phoneNumber,
      profile_image_url: profileImageUrl,
    };
    axios!
      .postRequest(request, null, WhatsApi.REGISTER_USER_URL)
      .then((_) => {
        auth?.setUserLoggedIn();
        navigate("/");
      })
      .catch((e: any) => {
        alert(e.message);
      });
  }

  return (
    <div className="page">
      <LoadingBar color="#00a884" progress={progressStatus.progressPercent} />
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
            <img className="stdImg" src={imageSrc} alt="profile" />
            <div
              className="cameraOverlay"
              onClick={() => fileInputRef!.current!.click()}
            >
              <CameraImg className="camera" />
            </div>
          </div>
          <form onSubmit={onSubmit} className="form">
            <input
              type="file"
              onChange={handleFileChange}
              hidden
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg"
            />
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
