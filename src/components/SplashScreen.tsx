import { useState, CSSProperties } from "react";
import BarLoader from "react-spinners/BarLoader";
import "../css/splashScreenStyle.css";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface Props {
  show: boolean;
}

const SplashScreen: React.FC<Props> = ({ show }) => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  if (!show) {
    return null;
  }

  return (
    <div className="spsContainer">
      <div className="sweet-loading">
        <BarLoader
          color={color}
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
