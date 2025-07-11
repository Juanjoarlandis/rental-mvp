import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export default function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  const loc = useLocation();
  return token ? children : <Navigate to="/login" replace state={{ from: loc }} />;
}
