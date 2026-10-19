/* eslint-disable react/prop-types */
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import isotipo from "../assets/logoMuni-sm.png";

// Menú lateral: sólo se usa en pantallas chicas (< 900px).
// Los ítems llegan ya armados desde NavBar para que ambos muestren lo mismo.
export default function SideBar({ abierto, onCerrar, onAbrir, grupos = [] }) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <SwipeableDrawer
      className="cd-shell cd-drawer"
      anchor="left"
      open={abierto}
      onClose={onCerrar}
      onOpen={onAbrir}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      <div className="cd-drawer__contenido" role="presentation">
        <div className="cd-drawer__cabecera">
          <span className="cd-brand" style={{ cursor: "default" }}>
            <img src={isotipo} alt="" />
            <span className="cd-brand__texto">
              <span className="cd-brand__sup">CIUDAD</span>
              <span className="cd-brand__nombre">SMT</span>
            </span>
          </span>
          <IconButton size="small" onClick={onCerrar} aria-label="Cerrar menú">
            <CloseRoundedIcon />
          </IconButton>
        </div>

        {grupos.map((grupo, indice) => (
          <div className="cd-drawer__grupo" key={grupo.titulo ?? indice}>
            {grupo.titulo && (
              <div className="cd-drawer__titulo">{grupo.titulo}</div>
            )}
            {grupo.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`cd-drawer__item${
                  item.activo ? " cd-drawer__item--activo" : ""
                }`}
                onClick={() => {
                  onCerrar();
                  item.onClick();
                }}
              >
                <item.Icono />
                {item.label}
              </button>
            ))}
          </div>
        ))}

        <p className="cd-drawer__pie">
          Desarrollado por Dirección de Innovación Tecnológica © 2025
        </p>
      </div>
    </SwipeableDrawer>
  );
}
