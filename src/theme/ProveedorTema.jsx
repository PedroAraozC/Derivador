import { useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import App from "../App.jsx";
import useStore from "../Zustand/Zustand";
import { crearTema } from "./temaCiudadDigital";

// Envuelve la app con el tema MUI según la preferencia guardada en el store
// y mantiene sincronizados los atributos de <html> que leen el CSS (data-tema)
// y Bootstrap (data-bs-theme).
export default function ProveedorTema() {
  const modoNocturno = useStore((s) => s.modoNocturno);

  const tema = useMemo(
    () => crearTema(modoNocturno ? "dark" : "light"),
    [modoNocturno]
  );

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.tema = modoNocturno ? "oscuro" : "claro";
    html.setAttribute("data-bs-theme", modoNocturno ? "dark" : "light");
  }, [modoNocturno]);

  return (
    <ThemeProvider theme={tema}>
      <App />
    </ThemeProvider>
  );
}
