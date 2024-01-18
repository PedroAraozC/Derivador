import { Navigate } from "react-router-dom";
import useStore from "../Zustand/Zustand";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { getAuth, authenticated, loading } = useStore();

  useEffect(() => {
    getAuth();
  }, []);

  return loading ? (
    <></>
  ) : authenticated ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
