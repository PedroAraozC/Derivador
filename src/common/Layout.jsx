import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return children;
  }

  return (
    <>
      <NavBar />
      {children}
    </>

  );
};

export default Layout;
