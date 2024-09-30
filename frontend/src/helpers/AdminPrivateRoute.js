import { Navigate } from "react-router-dom";
import auth from "./Auth";

export const AdminPrivateRoute = ({ children }) => {
  return auth.isAuthenticated().user.role === "admin"
    ? children
    : Navigate("/home");
};
