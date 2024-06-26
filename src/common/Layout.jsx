import NavBar from "./NavBar";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

  return (
    <>
      <NavBar />
      {children}
    </>

  );
};

export default Layout;
