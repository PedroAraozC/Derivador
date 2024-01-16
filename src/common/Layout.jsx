import SideBar from "./SideBar/Sidebar"
import useStore from "../Zustand/Zustand";

const Layout = ({children}) => {
  const { authenticated } = useStore();

  return (
    <>
    {authenticated? 
    <SideBar/> : <></>
  }
    {children}
    </>
  )
}

export default Layout