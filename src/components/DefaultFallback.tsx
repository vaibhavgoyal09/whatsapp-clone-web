import "../css/defaultFallbackStyle.css";

import { BeatLoader } from "react-spinners";

const DefaultFallback = () => {
  return (
    <div className="dfContainer">
      <BeatLoader loading color="#00a884" cssOverride={{ display: "block" }} />
    </div>
  );
};

export default DefaultFallback;
