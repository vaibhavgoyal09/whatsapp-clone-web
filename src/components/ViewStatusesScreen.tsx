import moment from "moment";
import { createRef, useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";
import { ReactComponent as LeftArrowIcon } from "../assets/left-arrow.svg";
import { ReactComponent as RighArrowIcon } from "../assets/right-arrow.svg";
import "../css/viewStatusesScreenStyle.css";
import Status, { StatusType } from "../models/Status";
import User from "../models/User";

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
  const [currentViewingStatus, setCurrentViewingStatus] =
    useState<Status | null>(null);
  const [progressDuration, setProgressDuration] = useState<number>(
    IMAGE_PREVIEW_DURATION_IN_SECONDS
  );
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const videoRef = createRef<HTMLVideoElement>();

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (statuses[currentStatusIndex + 1]) {
  //       setCurrentViewingStatus(statuses[currentStatusIndex + 1]);
  //     } else {
  //       onClose();
  //     }
  //   }, progressDuration * 1000);
  // }, [currentViewingStatus]);

  useEffect(() => {
    if (statuses.length >= 1) {
      setCurrentViewingStatus(statuses[0]);
    } else {
      onClose();
    }
  }, [currentContactUser]);

  useEffect(() => {
    if (currentViewingStatus) {
      let index = statuses.indexOf(currentViewingStatus);
      setCurrentStatusIndex(index);
    }
  }, [currentViewingStatus]);

  useEffect(() => {
    if (currentViewingStatus) {
      if (currentViewingStatus.type === StatusType.image) {
        setProgressDuration(IMAGE_PREVIEW_DURATION_IN_SECONDS);
      } else {
        const duration = videoRef?.current?.duration || 15;
        setProgressDuration(duration);
      }
    }
  }, [currentViewingStatus]);

  const handleRightArrowClicked = () => {
    if (currentStatusIndex === statuses.length - 1) {
      onNextCliked();
    } else {
      let index = statuses.indexOf(currentViewingStatus!);
      setCurrentViewingStatus(statuses[index + 1]);
    }
  };

  const handleLeftArrowClicked = () => {
    if (currentStatusIndex <= 0) {
      onPreviousClicked();
    } else {
      let index = statuses.indexOf(currentViewingStatus!);
      setCurrentViewingStatus(statuses[index - 1]);
    }
  };

  return (
    <div className="statusesScreenDialogOverlay">
      <CloseIcon
        className="sscIcon"
        id="sscCloseIcon"
        onClick={() => onClose()}
      />
      {statuses.length > 0 ? (
        <div className="sscStatusContentWrapper">
          <div className="sscHeader">
            <div className="sscProgressWrapper">
              {statuses.map((_) => (
                <div key={Math.random()}></div>
              ))}
            </div>
            <div className="sscUserDetailsWrapper">
              <img
                id="sscUserImg"
                src={currentContactUser.profileImageUrl}
                alt="User Profile"
              />
              <h3 id="sscUserName" className="unselectable">
                {currentContactUser.name}
              </h3>
              <h4 id="sscLastUpdated" className="unselectable">
                •{" "}
                {moment(new Date(currentViewingStatus?.createdAt!)).fromNow(
                  true
                )}
              </h4>
            </div>
          </div>
          <div className="sscMediaDisplay">
            {currentViewingStatus?.type === StatusType.image ? (
              <img
                id="sscMediaImage"
                src={currentViewingStatus?.mediaUrl}
                alt=""
              />
            ) : (
              <video
                src={currentViewingStatus?.mediaUrl}
                autoPlay
                ref={videoRef}
              />
            )}
          </div>
        </div>
      ) : null}
      <LeftArrowIcon
        onClick={() => handleLeftArrowClicked()}
        className="sscIconLarge"
        id="sscLeftIcon"
      />
      <RighArrowIcon
        onClick={() => handleRightArrowClicked()}
        className="sscIconLarge"
        id="sscRightIcon"
      />
    </div>
  );
};

export default ViewStatusesScreen;
