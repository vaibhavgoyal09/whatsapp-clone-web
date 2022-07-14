import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // console.log(currentUser);
  return children;

  if (!currentUser) {
    return <Navigate to="/auth" />;
  } else {
    
  }
};

export default ProtectedRoute;
