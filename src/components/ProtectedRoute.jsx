import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) {
    return navigate("/auth");
  } else if (currentUser && location.pathname === "/auth") {
    navigate("/");
  } else {
    return children;
  }
};

export default ProtectedRoute;
