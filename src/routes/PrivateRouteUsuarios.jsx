import { Navigate } from "react-router-dom";
import useStore from "../Zustand/Zustand";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

// eslint-disable-next-line react/prop-types
const PrivateRouteUsuarios = ({ children }) => {
  const { getAuth, authenticated, loading, user, permisos } = useStore();
  console.log(permisos.filter(p=>p.id_proceso === 81 && p.ver === 1 ));
  useEffect(() => {
    getAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : authenticated && ((user.id_tusuario == 1 || user.id_tusuario == 40) || (permisos.filter(p=>p.id_proceso === 85 && p.ver === 1 ).length > 0)) ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRouteUsuarios;
