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
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HomeIcon from "@mui/icons-material/Home";
import FeedbackIcon from "@mui/icons-material/Feedback";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import "./SideBar.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function ListaPrueba() {
  const [state, setState] = React.useState({
    left: false,
  });
  const [openListEstadistica, setOpenListEstadistica] = React.useState(false);

  const navigate = useNavigate();

  const redirigir = (ruta) => {
    navigate(ruta);
    setState(false)
    setOpenListEstadistica(false)
  };

// const irAGAF = () => {
//   const token = localStorage.getItem("token");
//   const url = new URL(`http://localhost:5173/`);
//   url.searchParams.append("GAF", token);
//   window.open(url.toString(), "_blank");
// };

  const handleClickEstadistica = () => {
    setOpenListEstadistica(!openListEstadistica);
  };

  const toggleDrawer = (open)  => {
    setState({ left: open });
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      className="d-flex justify-content-between flex-column h-100"
    >
      <div className="d-flex flex-column justify-content-center align-items-center mt-5 ">
        <ListItemButton
          onClick={() => redirigir("/home")}
          component="a"
          className="w-100"
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItemButton>
        {/* GESTION FINANCIERA */}
          {/* <ListItemButton
            onClick={() => irAGAF()}
            component="a"
            className="w-100"
            >
            <ListItemIcon>
              <AttachMoneyIcon/>
            </ListItemIcon>
            <ListItemText primary="Gestión Financiera" />
          </ListItemButton> */}
         {/* GESTION FINANCIERA */}
         {/* ESTADISTICAS */}
        <ListItemButton onClick={handleClickEstadistica} className="w-100">
          <ListItemIcon>
            <QueryStatsIcon/>
          </ListItemIcon>
          <ListItemText primary="Estadisticas" />
          {openListEstadistica ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
          <Collapse in={openListEstadistica} timeout="auto" unmountOnExit>
            <List component="div">
              <ListItemButton
                onClick={() => redirigir("/cap-humano")}
                component="a"
                className="w-100"
                >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Capital Humano" />
              </ListItemButton>
              <ListItemButton
                onClick={() => redirigir("/reclamos-estadisticas")}
                component="a"
                className="w-100"
              >
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText primary="Atención Ciudadana" />
              </ListItemButton>
            </List>
          </Collapse>
          {/* ESTADISTICAS */}
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <p className="footer text-center">
          Desarrollado por Dirección de Innovación Tecnológica
          <span style={{ fontSize: "1.4em", verticalAlign: "-0.1em" }}>©</span>{" "}
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
        onClick={()=>toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={state.left}
        onClose={()=>toggleDrawer(false)}
        onOpen={()=>toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  );
}
