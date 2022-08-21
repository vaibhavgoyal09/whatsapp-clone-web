import { useState } from "react";
import "../css/createNewStatusDialogStyle.css";
import { ReactComponent as ImageVideoIcon } from "../assets/image_video.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNewStatusDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const [media, setMedia] = useState<File | null>(null);
  const [showDoneScreen, setShowDoneScreen] = useState(false);

  if (!isOpen) {
    return null;
  }

  const sampleImage = require("../assets/sample_image.jpg");

  return (
    <div className="cnsDialogContainer" onClick={() => onClose()}>
      <div className="cnsDialogContent" onClick={(e) => e.stopPropagation()}>
        <div className="cnsHeader">
          {showDoneScreen ? (
            <span id="cnsBackBtn">
              <i className="fa-solid fa-arrow-left-long"></i>
            </span>
          ) : null}
          <p id="cnsText" className="unselectable">Create new status</p>
          {showDoneScreen ? <p id="cnsShareText">share</p> : null}
        </div>
        {showDoneScreen ? <div className="cnsMediaPreview">
          <img src={sampleImage} alt="" />
        </div> : <div className="cnsMediaDropper">
          <div className="cnsMediaDropperContentWrpr">
            <ImageVideoIcon id="imageVideoIcon" />
            <p id="cnsDropContextText">Drag photos and videos here</p>
            <button className="cnsSelectFromComputerBtn pBtn">
              Select from computer
            </button>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default CreateNewStatusDialog;
