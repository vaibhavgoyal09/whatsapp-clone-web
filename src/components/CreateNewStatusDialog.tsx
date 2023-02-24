import React, { useState, createRef, useEffect, useCallback } from "react";
import "../css/createNewStatusDialogStyle.css";
import { ReactComponent as ImageVideoIcon } from "../assets/image_video.svg";
import MutedIcon from "../assets/muted.svg";
import UnmuteIcon from "../assets/unmute.svg";
import { useAxios } from "../context/AxiosContext";
import CreateStatusRequest from "../models/CreateStatusRequest";
import { StatusType } from "../models/Status";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewStatusClicked: (request: CreateStatusRequest) => void;
}

const CreateNewStatusDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreateNewStatusClicked,
}) => {
  const [media, setMedia] = useState<File | null>(null);
  const [showDoneScreen, setShowDoneScreen] = useState(true);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("");
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const dropAreaRef = createRef<HTMLDivElement>();
  const axios = useAxios()!!;

  useEffect(() => {
    dropAreaRef.current?.addEventListener("dragover", handleDragOver);
    dropAreaRef.current?.addEventListener("drop", handleDrop);
    dropAreaRef.current?.addEventListener("dragenter", handleDragIn);
    dropAreaRef.current?.addEventListener("dragleave", handleDragOut);

    return () => {
      dropAreaRef.current?.removeEventListener("dragover", handleDragOver);
      dropAreaRef.current?.removeEventListener("drop", handleDrop);
      dropAreaRef.current?.removeEventListener("dragenter", handleDragIn);
      dropAreaRef.current?.removeEventListener("dragend", handleDragOut);
    };
  });

  useEffect(() => {
    if (media) {
      setShowDoneScreen(true);
      let tempUrl = URL.createObjectURL(media);
      setMediaUrl(tempUrl);

      if (
        media.type === "image/jpeg" ||
        media.type === "image/png" ||
        media.type === "image/jpg"
      ) {
        setMediaType("image");
      } else if (media.type === "video/mp4" || media.type === "video/mkv") {
        setMediaType("video");
      }
    } else {
      setShowDoneScreen(false);
    }
  }, [media]);

  const handleDragIn = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    let files = e.dataTransfer.files;

    if (files && files.length > 0) {
      setMedia(files[0]);
    }
    e.dataTransfer.clearData();
  };

  const handlePlayPauseBtnClicked = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  const handleBackButtonClicked = useCallback(() => {
    setMedia(null);
  }, []);

  const handleShareBtnClicked = async () => {
    if (!media) {
      return;
    }

    let tempMediaUrl: string | null = null;

    try {
      await axios.safeApiRequest(async () => {
        tempMediaUrl = await axios.uploadFile(media);
      });
    } catch (e: any) {
      alert(e.message);
      return;
    }

    if (!tempMediaUrl) {
      return;
    }

    let request: CreateStatusRequest = {
      type: mediaType === "image" ? StatusType.image : StatusType.video,
      media_url: tempMediaUrl,
    };

    onCreateNewStatusClicked(request);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="cnsDialogContainer"
      onClick={() => {
        setMedia(null);
        onClose();
      }}
    >
      <div className="cnsDialogContent" onClick={(e) => e.stopPropagation()}>
        <div className="cnsHeader">
          {showDoneScreen ? (
            <span id="cnsBackBtn" onClick={handleBackButtonClicked}>
              <i className="fa-solid fa-arrow-left-long"></i>
            </span>
          ) : null}
          <p id="cnsText" className="unselectable">
            Create new status
          </p>
          {showDoneScreen ? (
            <p id="cnsShareText" onClick={() => handleShareBtnClicked()}>
              share
            </p>
          ) : null}
        </div>
        {showDoneScreen && mediaUrl ? (
          <div className="cnsMediaPreview">
            {mediaType === "image" ? (
              <img id="cnsMediaImage" src={mediaUrl} />
            ) : (
              <div className="cnsVideoContainer">
                <div
                  className="cnsVideoControlsContainer"
                  onClick={() => handlePlayPauseBtnClicked()}
                >
                  <div className="cnsControls">
                    <img
                      id="cnsPlayPauseBtn"
                      src={isVideoMuted ? MutedIcon : UnmuteIcon}
                      alt="play pause icon"
                    />
                  </div>
                </div>
                <video src={mediaUrl} autoPlay loop muted={isVideoMuted} />
              </div>
            )}
          </div>
        ) : (
          <div className="cnsMediaDropper" ref={dropAreaRef}>
            <div className="cnsMediaDropperContentWrpr">
              <ImageVideoIcon id="imageVideoIcon" />
              <p id="cnsDropContextText">Drag photos and videos here</p>
              <button className="cnsSelectFromComputerBtn pBtn">
                Select from computer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNewStatusDialog;
