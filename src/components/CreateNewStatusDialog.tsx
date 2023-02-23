import { useState, createRef, useEffect, useCallback } from "react";
import "../css/createNewStatusDialogStyle.css";
import { ReactComponent as ImageVideoIcon } from "../assets/image_video.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNewStatusDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const [media, setMedia] = useState<File | null>(null);
  const [showDoneScreen, setShowDoneScreen] = useState(true);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const dropAreaRef = createRef<HTMLDivElement>();

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
    } else {
      setShowDoneScreen(false);
    }
  }, [media]);

const sampleImage = require('../assets/sample_image.jpg');

  const handleDragIn = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      console.log("yeah, there are some files");
    }
  }

  const handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    let files = e.dataTransfer.files;

    if (files && files.length > 0) {
      console.log(`file droped ${files}`);
      setMedia(files[0]);
    }
    e.dataTransfer.clearData();
  };

  const handleBackButtonClicked = useCallback(() => {
    setMedia(null);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cnsDialogContainer" onClick={() => {
      setMedia(null);
      onClose()
    }}>
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
          {showDoneScreen ? <p id="cnsShareText">share</p> : null}
        </div>
        {showDoneScreen ? (
          <div className="cnsMediaPreview">
            {mediaUrl ? <img src={mediaUrl} alt="" /> : <img src={sampleImage}/>}
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
