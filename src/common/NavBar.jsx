import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import useStore from "../Zustand/Zustand";
import NavBarEsqueleto from "../components/Esqueletos/NavBarEsqueleto";
import "./Navbar.css";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { getAuth, authenticated, logout, user } = useStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToPerfil = () => {
    setAnchorEl(null);
    navigate('/perfil')
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
    setAnchorEl(null);
  };

  return (
    <>
      {authenticated ? (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <SideBar />
              <div className="d-flex justify-content-between align-items-center w-100">
                {/* <img src={logoMuni} className="logoMuni2" /> */}
                <p></p>
                {authenticated && (
                  <div>
                    {user.nombreUsuario}
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle
                      />
                    </IconButton>
                    <Menu
                      className="logOut"
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      {/* crear la funcion y componente perfil  */}
                      <MenuItem onClick={goToPerfil}>Mi perfil</MenuItem>
                      <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                    </Menu>
                  </div>
                )}
              </div>
              {/* <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search> */}
            </Toolbar>
          </AppBar>
        </Box>
      ) : localStorage.getItem("token") ? (
        <NavBarEsqueleto />
      ) : (
        <></>
      )}
    </>
  );
}
