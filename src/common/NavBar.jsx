import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import useStore from "../Zustand/Zustand";
import SideBar from "./SideBar";
import { registrarAccesoExterno } from "../helpers/registrarAccesoExterno";
import {
  construirSecciones,
  permisosPorOpcion,
} from "../helpers/seccionesHome";
import isotipo from "../assets/logoMuni-sm.png";
import "./Navbar.css";

const iniciales = (user) =>
  `${user?.nombre_persona?.[0] ?? ""}${user?.apellido_persona?.[0] ?? ""}`.toUpperCase();

// "Mi Perfil" y "Cambiar Clave" están fijos en el menú de usuario; si el backend
// además los manda como permisos de "EDICION DE PERFIL", se omiten para no repetirlos.
const normalizar = (texto) =>
  (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
const ITEMS_FIJOS_PERFIL = [/perfil/, /clave|contrasena|password/];
const esItemFijoPerfil = (permiso) => {
  const etiqueta = normalizar(permiso.descripcion || permiso.nombre_proceso);
  return ITEMS_FIJOS_PERFIL.some((patron) => patron.test(etiqueta));
};

function BarraNavegacion() {
  const {
    logout,
    user,
    obtenerPermisos,
    permisos,
    modoNocturno,
    alternarModoNocturno,
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [anchorUsuario, setAnchorUsuario] = useState(null);
  const [anchorConfig, setAnchorConfig] = useState(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  useEffect(() => {
    obtenerPermisos(user?.id_tusuario, user?.id_persona);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Acciones (misma lógica que el navbar/sidebar anterior) ----------
  const goToPerfil = () => {
    setAnchorUsuario(null);
    const url = new URL(`https://perfil.smt.gob.ar/`);
    url.searchParams.append("auth", localStorage.getItem("token"));
    url.searchParams.append("origin", "cidituc");
    window.location.href = url.toString();
  };

  const goToCambiarClave = () => {
    setAnchorUsuario(null);
    const url = new URL(`https://perfil.smt.gob.ar//#/redireccion/password`);
    url.searchParams.append("auth", localStorage.getItem("token"));
    url.searchParams.append("origin", "cidituc");
    window.location.href = url.toString();
  };

  const handleLogout = () => {
    logout();
    setAnchorUsuario(null);
  };

  const abrirPermiso = (permiso) => {
    const token = localStorage.getItem("token");
    if (permiso.sistema_externo == null) {
      navigate(`/${permiso.nombre_proceso}`);
    } else {
      registrarAccesoExterno(permiso.id_proceso, permiso.id_opcion, user);
      const url = new URL(`${permiso.sistema_externo}/?auth=${token}`);
      url.searchParams.append("auth", token);
      window.open(url.toString(), "_blank");
    }
  };

  const redirigirGAF = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = `https://gafdesarrollo.smt.gob.ar/?auth=${encodeURIComponent(token)}`;
    const nueva = window.open(url, "_blank", "noopener,noreferrer");

    // Borra la URL con token del historial de la pestaña nueva
    if (nueva) {
      nueva.onload = () => {
        nueva.history.replaceState(null, "", "/");
      };
    }
  };

  const irA = (ruta) => navigate(ruta);
  const irASeccion = (id) =>
    navigate({ pathname: "/home", search: `?seccion=${id}` });

  // ---------- Ítems de navegación derivados de los permisos ----------
  const enHome =
    location.pathname === "/home" || location.pathname === "/";
  const seccionParam = searchParams.get("seccion");

  const secciones = useMemo(
    () => construirSecciones(permisos, user),
    [permisos, user]
  );
  const configuracion = useMemo(
    () => permisosPorOpcion(permisos, "CONFIGURACIÓN"),
    [permisos]
  );
  const opcionesPerfil = useMemo(
    () =>
      permisosPorOpcion(permisos, "EDICION DE PERFIL").filter(
        (permiso) => !esItemFijoPerfil(permiso)
      ),
    [permisos]
  );

  const itemsPrincipales = [
    {
      id: "inicio",
      label: "Inicio",
      Icono: HomeOutlinedIcon,
      activo: enHome && !seccionParam,
      onClick: () => irA("/home"),
    },
    ...secciones.map((seccion) => ({
      id: seccion.id,
      label: seccion.titulo,
      Icono: seccion.icono,
      activo: enHome && seccionParam === seccion.id,
      onClick: () => irASeccion(seccion.id),
    })),
  ];

  const itemsAdmin = [];
  if (user.id_tusuario == 1) {
    itemsAdmin.push({
      id: "dashboard",
      label: "Dashboard",
      Icono: InsightsOutlinedIcon,
      activo: location.pathname === "/dashboard-sistemas",
      onClick: () => irA("/dashboard-sistemas"),
    });
  }
  if (user.documento_persona == "20257712304") {
    itemsAdmin.push({
      id: "gaf",
      label: "GAF Pruebas",
      Icono: OpenInNewRoundedIcon,
      activo: false,
      onClick: redirigirGAF,
    });
  }

  const itemsConfiguracion = configuracion.map((permiso) => ({
    id: permiso.id_proceso,
    label: permiso.descripcion || permiso.nombre_proceso,
    Icono: TuneRoundedIcon,
    activo: location.pathname === `/${permiso.nombre_proceso}`,
    onClick: () => abrirPermiso(permiso),
  }));
  const configActiva = itemsConfiguracion.some((item) => item.activo);

  const gruposDrawer = [
    { titulo: null, items: itemsPrincipales },
    { titulo: "Administración", items: itemsAdmin },
    { titulo: "Configuración", items: itemsConfiguracion },
  ].filter((grupo) => grupo.items.length > 0);

  const renderTab = (item) => (
    <button
      key={item.id}
      type="button"
      className={`cd-tab${item.activo ? " cd-tab--activa" : ""}`}
      onClick={item.onClick}
      aria-current={item.activo ? "page" : undefined}
    >
      <item.Icono />
      {item.label}
    </button>
  );

  return (
    <header className="cd-shell cd-nav">
      <div className="cd-nav__inner">
        <IconButton
          className="cd-hamburguesa"
          aria-label="Abrir menú"
          onClick={() => setDrawerAbierto(true)}
          size="small"
        >
          <MenuRoundedIcon />
        </IconButton>

        <button
          type="button"
          className="cd-brand"
          onClick={() => irA("/home")}
          aria-label="Ir al inicio"
        >
          <img src={isotipo} alt="" />
          <span className="cd-brand__texto">
            <span className="cd-brand__sup">CIUDAD</span>
            <span className="cd-brand__nombre">SMT</span>
          </span>
        </button>

        <nav className="cd-tabs" aria-label="Secciones">
          {itemsPrincipales.map(renderTab)}
          {itemsAdmin.map(renderTab)}
          {itemsConfiguracion.length > 0 && (
            <button
              type="button"
              className={`cd-tab${configActiva ? " cd-tab--activa" : ""}`}
              onClick={(e) => setAnchorConfig(e.currentTarget)}
              aria-haspopup="menu"
              aria-expanded={Boolean(anchorConfig)}
            >
              <SettingsOutlinedIcon />
              Configuración
              <ExpandMoreRoundedIcon
                className={`cd-tab__chevron${
                  anchorConfig ? " cd-tab__chevron--abierto" : ""
                }`}
              />
            </button>
          )}
        </nav>

        <div className="cd-nav__derecha">
          <IconButton
            className="cd-nav__tema"
            size="small"
            onClick={alternarModoNocturno}
            aria-label={
              modoNocturno ? "Activar modo claro" : "Activar modo nocturno"
            }
            title={modoNocturno ? "Activar modo claro" : "Activar modo nocturno"}
          >
            {modoNocturno ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <button
            type="button"
            className="cd-usuario"
            onClick={(e) => setAnchorUsuario(e.currentTarget)}
            aria-haspopup="menu"
            aria-expanded={Boolean(anchorUsuario)}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 600,
                bgcolor: "var(--cd-accent-suave)",
                color: "var(--cd-accent-fuerte)",
              }}
            >
              {iniciales(user) || <PersonOutlineRoundedIcon fontSize="small" />}
            </Avatar>
            <span className="cd-usuario__nombre d-none d-sm-inline">
              {user?.nombre_persona}
            </span>
            <ExpandMoreRoundedIcon className="cd-usuario__chevron d-none d-sm-inline-block" />
          </button>
        </div>
      </div>

      {/* Menú Configuración (desktop) */}
      <Menu
        className="cd-menu"
        anchorEl={anchorConfig}
        open={Boolean(anchorConfig)}
        onClose={() => setAnchorConfig(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {itemsConfiguracion.map((item) => (
          <MenuItem
            key={item.id}
            selected={item.activo}
            onClick={() => {
              setAnchorConfig(null);
              item.onClick();
            }}
          >
            <ListItemIcon>
              <item.Icono />
            </ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Menú de usuario */}
      <Menu
        className="cd-menu"
        id="menu-appbar"
        anchorEl={anchorUsuario}
        open={Boolean(anchorUsuario)}
        onClose={() => setAnchorUsuario(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="cd-menu__cabecera">
          <strong>
            {user?.nombre_persona} {user?.apellido_persona}
          </strong>
          {user?.email_persona && <span>{user.email_persona}</span>}
        </div>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={goToPerfil}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={goToCambiarClave}>
          <ListItemIcon>
            <LockOutlinedIcon />
          </ListItemIcon>
          Cambiar Clave
        </MenuItem>
        {opcionesPerfil.map((permiso) => (
          <MenuItem
            key={permiso.id_proceso}
            onClick={() => {
              setAnchorUsuario(null);
              abrirPermiso(permiso);
            }}
          >
            <ListItemIcon>
              <ManageAccountsOutlinedIcon />
            </ListItemIcon>
            {permiso.descripcion || permiso.nombre_proceso}
          </MenuItem>
        ))}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem className="cd-menu__salir" onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Drawer móvil */}
      <SideBar
        abierto={drawerAbierto}
        onCerrar={() => setDrawerAbierto(false)}
        onAbrir={() => setDrawerAbierto(true)}
        grupos={gruposDrawer}
      />
    </header>
  );
}

export default function NavBar() {
  const { getAuth, authenticated } = useStore();

  useEffect(() => {
    getAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authenticated ? <BarraNavegacion /> : null;
}
