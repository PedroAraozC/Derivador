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
import DvrIcon from "@mui/icons-material/Dvr";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import TuneIcon from "@mui/icons-material/Tune";
import HomeIcon from "@mui/icons-material/Home";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "./SideBar.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useStore from "../Zustand/Zustand";
// import ArticleIconOutlined from "@mui/icons-material/ArticleOutlined";

export default function ListaPrueba() {
  const navigate = useNavigate();
  const redirigir = (ruta) => {
    navigate(ruta);
    setState(false);
  };

  const irAGAF = () => {
    const token = localStorage.getItem("token");
    const url = new URL(`http://181.105.6.205:9005/`);
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irABOLETIN = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://boletinoficial.smt.gob.ar/#/?auth=${token}&destino=boletin`
      // `https://ciudaddigital.smt.gob.ar/?destino=boletin`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const { user, obtenerPermisos, permisos } = useStore();
  const [state, setState] = React.useState({
    left: false,
  });
  const [openLists, setOpenLists] = React.useState({}); // Estado para controlar qué listas están abiertas

  const handleClick = (label) => {
    setOpenLists({ ...openLists, [label]: !openLists[label] });
  };

  const toggleDrawer = (open) => {
    setState({ left: open });
  };
  const mapearIcono = (nombreOpcion) => {
    switch (nombreOpcion) {
      case "SERVICIOS":
        return <DvrIcon />;
      case "REPORTES":
        return <ReportGmailerrorredIcon />;
      case "ESTADISTICAS":
        return <QueryStatsIcon />;
      case "PARAMETROS":
        return <TuneIcon />;
      case "GESTION DE USUARIO":
        return <PersonIcon />;
      case "GESTION FINANCIERA":
        return <AttachMoneyIcon />;
      case "PANEL ADMIN":
        return <AdminPanelSettingsIcon />;
      default:
        return <AccountTreeIcon />;
    }
  };

  React.useEffect(() => {
    obtenerPermisos(user.id_tusuario);
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
          { label: permiso.nombre_proceso, descripcion: permiso.descripcion },
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
        });
      }
    }
    return menu;
  }, []);

  //FILTRADO PARA SACAR LA OPCION DE EDITAR PERFIL DEL SIDEBAR
  const menuItemsFiltered = menuItems.slice(2);
  // console.log(menuItemsFiltered)

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
        {/* <ListItemButton
          onClick={() => irABOLETIN()}
          component="a"
          className="w-100"
        >
          <ArticleIconOutlined sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
          <ListItemText primary="BOLETIN" className="ms-3"/>
        </ListItemButton> */}
        {/* Construye cada elemento del menú */}
        {menuItemsFiltered.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between w-100 flex-column"
          >
            {/* Elemento del menú */}
            <ListItemButton onClick={() => handleClick(item.label)}>
              <ListItemIcon>{mapearIcono(item.label)}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.subItems &&
                (openLists[item.label] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {/* Sub-elementos del menú si existen */}
            {item.subItems && (
              <Collapse in={openLists[item.label]} timeout="auto" unmountOnExit>
                <List component="div">
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      component="a"
                      className="w-100"
                    >
                      <ListItemText
                        primary={subItem.descripcion}
                        onClick={
                          subItem.descripcion == "Gestión Financiera"
                            ? () => irAGAF()
                            : subItem.descripcion == "Boletín Municipal"
                            ? () => irABOLETIN()
                            : () => redirigir(`/${subItem.label}`)
                        }
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
        <p className="footer text-center">
          Desarrollado por Dirección de Innovación Tecnológica
          <span style={{ fontSize: "1.4em", verticalAlign: "-0.1em" }}>
            ©
          </span>{" "}
          2024
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
