import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  console.log(currentUser);

  if (!currentUser) {
    return <Navigate to="/auth" />;
  } else {
    return children;
  }
};

export default ProtectedRoute;