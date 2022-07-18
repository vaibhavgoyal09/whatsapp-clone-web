import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = ({ children }: {children: JSX.Element;}) => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const location = useLocation();
 
  if (!currentUser) {
    return <Navigate to="/auth" state={{from: location}} replace/>
  }
  return children;
};

export default ProtectedRoute;
