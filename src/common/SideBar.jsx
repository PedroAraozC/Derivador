import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuizIcon from '@mui/icons-material/Quiz';
import EventIcon from '@mui/icons-material/Event';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HomeIcon from "@mui/icons-material/Home";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import "./SideBar.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useStore from "../Zustand/Zustand";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";

export default function ListaPrueba() {
  const { user, obtenerPermisos, permisos } = useStore();
  const [state, setState] = React.useState({
    left: false,
  });
  const navigate = useNavigate();
  const redirigir = (ruta) => {
    navigate(ruta);
    setState(false);
  };

  const [openList, setOpenList] = React.useState(null); // Estado para controlar qué lista está abierta

  const handleClick = (label) => {
    // Si el label ya está abierto, ciérralo; de lo contrario, abre el nuevo y cierra el anterior
    setOpenList(openList === label ? null : label);
  };

  const toggleDrawer = (open) => {
    setState({ left: open });
  };

  const mapearIcono = (nombreOpcion) => {
    switch (nombreOpcion) {
      case "CONSULTAS":
        return <QuizIcon />;
      case "APLICACIONES":
        return <BadgeIcon />;
      case "TURNOS":
        return <EventIcon />;
      case "TRAMITES":
        return <ArrowOutwardIcon />;
      case "CONFIGURACIÓN":
        return <BuildOutlinedIcon />;
      case "EDICION DE PERFIL":
        return <AccountBoxOutlinedIcon />;
      default:
        return <AccountTreeIcon />;
    }
  };

  React.useEffect(() => {
    obtenerPermisos(user?.id_tusuario, user?.id_persona);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Filtra para tener permisos habilitados segun la persona
  const permisosHabilitados = permisos.filter((permiso) => permiso.ver === 1);

  // Construir menuItems a partir de los permisos habilitados
  const menuItems = permisosHabilitados.reduce((menu, permiso) => {
    const menuItemIndex = menu.findIndex(
      (item) => item.label === permiso.nombre_opcion
    );
    if (menuItemIndex === -1) {
      // Si no existe un menuItem con la misma etiqueta, lo creamos
      const menuItem = {
        label: permiso.nombre_opcion,
        subItems: [
          { label: permiso.nombre_proceso, descripcion: permiso.descripcion, sistema_externo: permiso.sistema_externo },
        ],
      };
      menu.push(menuItem);
    } else {
      // Si ya existe un menuItem con la misma etiqueta, verificamos si el subItem ya existe
      const subItemIndex = menu[menuItemIndex].subItems.findIndex(
        (subItem) => subItem.label === permiso.nombre_proceso
      );
      if (subItemIndex === -1) {
        // Si el subItem no existe, lo agregamos
        menu[menuItemIndex].subItems.push({
          label: permiso.nombre_proceso,
          descripcion: permiso.descripcion,
          sistema_externo: permiso.sistema_externo,
        });
      }
    }
    return menu;
  }, []);

  const handleOptionClick = (option) => {
    const token = localStorage.getItem("token");

    if (option.sistema_externo == null) {
      navigate(`/${option.label}`);
    } else {
      const url = new URL(`${option.sistema_externo}/?auth=${token}`);
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

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      className="d-flex justify-content-between flex-column h-100"
    >
      <div className="d-flex flex-column justify-content-center align-items-start mt-5">
        {/* Inicio */}
        <ListItemButton
          onClick={() => redirigir("/home")}
          component="a"
          className="w-100"
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="INICIO" />
        </ListItemButton>

        {
          user.documento_persona == "20257712304" &&
          <ListItemButton
            onClick={redirigirGAF}
            className="w-100"
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="GAF PRUEBAS" />
          </ListItemButton>
        }


        {/* Construye cada elemento del menú */}
        {menuItems.sort((a,b) =>a.label.localeCompare(b.label)).map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between w-100 flex-column"
          >
            {/* Elemento del menú */}
            <ListItemButton
              onClick={() => handleClick(item.label)}
              className="itemsSidebar"
            >
              <ListItemIcon>{mapearIcono(item.label)}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.subItems &&
                (openList === item.label ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {/* Sub-elementos del menú si existen */}
            {item.subItems && (
              <Collapse
                in={openList === item.label}
                timeout="auto"
                unmountOnExit
              >
                <List component="div">
                  {item.subItems.sort((a,b) =>a.descripcion.localeCompare(b.descripcion)).map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      component="a"
                      className="w-100 ps-5 subitemsSidebar"
                    >
                      <ListItemText
                        primary={subItem.descripcion}
                        onClick={() => handleOptionClick(subItem)}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <p className="footer text-center mt-5">
          Desarrollado por Dirección de Innovación Tecnológica
          <span style={{ fontSize: "1.4em", verticalAlign: "-0.1em" }}>
            ©
          </span>{" "}
          2025
        </p>
      </div>
    </Box>
  );

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={() => toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={state.left}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  );
}
