import { useNavigate } from "react-router-dom";
import auth from "./Auth";

export const ModeratorPrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  return auth.isAuthenticated().user.role === "moderator" ? children : navigate("/home");
};
