import { Navigate } from "react-router-dom";
import useStore from "../Zustand/Zustand";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

// eslint-disable-next-line react/prop-types
const PrivateRouteEmpleadoJerarquico = ({ children }) => {
    const { getAuth, authenticated, loading, user } = useStore();

    useEffect(() => {
        getAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? (
        <Box sx={{ display: "flex" }}>
            <CircularProgress />
        </Box>
    ) : authenticated && user.id_tusuario == 5 || user.id_tusuario == 1 ? (
        children
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRouteEmpleadoJerarquico;
