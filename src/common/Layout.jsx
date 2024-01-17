import SideBar from "./SideBar/Sidebar"
import useStore from "../Zustand/Zustand";
import NavBar from "./NavBar";

const Layout = ({children}) => {
  const { authenticated } = useStore();

  return (
    <>
    {authenticated? 
    // <SideBar/>
    <NavBar/>
     : <></>
  }
    {children}
    </>
  )
}

export default Layout