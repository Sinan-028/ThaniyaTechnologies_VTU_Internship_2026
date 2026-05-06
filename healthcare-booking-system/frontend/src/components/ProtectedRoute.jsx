import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  //  ROLE FIX (IMPORTANT)
  if (role && user.role !== role) {
    return user.role === "doctor"
      ? <Navigate to="/doctor-dashboard" />
      : <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;