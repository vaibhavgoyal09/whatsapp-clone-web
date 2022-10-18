import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";
import "../css/viewStatusesScreenStyle.css";
import { ReactComponent as LeftArrowIcon } from "../assets/left-arrow.svg";
import { ReactComponent as RighArrowIcon } from "../assets/right-arrow.svg";
import User from "../models/User";
import Status, { StatusType } from "../models/Status";
import { createRef, useCallback, useEffect, useState } from "react";

interface Props {
  currentContactUser: User;
  statuses: Status[];
  onNextCliked: () => void;
  onPreviousClicked: () => void;
  onClose: () => void;
}

const IMAGE_PREVIEW_DURATION_IN_SECONDS = 5;

const ViewStatusesScreen: React.FC<Props> = ({
  currentContactUser,
  statuses,
  onNextCliked,
  onPreviousClicked,
  onClose,
}) => {
  const [currentViewingStatus, setCurrentViewingStatus] = useState<Status>(
    statuses[0]
  );
  const [progressDuration, setProgressDuration] = useState<number>(
    IMAGE_PREVIEW_DURATION_IN_SECONDS
  );
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const videoRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    let index = statuses.indexOf(currentViewingStatus);
    setCurrentStatusIndex(index);
  }, [currentViewingStatus]);

  useEffect(() => {
    if (currentViewingStatus.type === StatusType.image) {
      setProgressDuration(IMAGE_PREVIEW_DURATION_IN_SECONDS);
    } else {
      const duration = videoRef?.current?.duration || 15;
      setProgressDuration(duration);
    }
  }, [currentViewingStatus]);

  const handleRightArrowClicked = useCallback(() => {
    if (currentStatusIndex === statuses.length - 1) {
      onNextCliked();
    } else {
      let index = statuses.indexOf(currentViewingStatus);
      setCurrentViewingStatus(statuses[index + 1]);
    }
  }, []);

  const handleLeftArrowClicked = useCallback(() => {
    if (currentStatusIndex <= 0) {
      onPreviousClicked();
    } else {
      let index = statuses.indexOf(currentViewingStatus);
      setCurrentViewingStatus(statuses[index + 1]);
    }
  }, []);

  return (
    <div className="statusesScreenDialogOverlay">
      <CloseIcon
        className="sscIcon"
        id="sscCloseIcon"
        onClick={() => onClose()}
      />
      <div className="sscStatusContentWrapper">
        <div className="sscMediaDisplay">
          {currentViewingStatus.type === StatusType.image ? (
            <img src={currentViewingStatus.mediaUrl} alt="" />
          ) : (
            <video src={currentViewingStatus.mediaUrl} ref={videoRef} />
          )}
          <div className="sscProgressContainer">
            <div className="sscProgress"></div>
          </div>
        </div>
      </div>
      {currentStatusIndex > 0 ? (
        <LeftArrowIcon
          onClick={() => handleLeftArrowClicked()}
          className="sscIconLarge"
          id="sscLeftIcon"
        />
      ) : null}
      <RighArrowIcon
        onClick={() => handleRightArrowClicked()}
        className="sscIconLarge"
        id="sscRightIcon"
      />
    </div>
  );
};

export default ViewStatusesScreen;
