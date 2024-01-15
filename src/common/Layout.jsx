import SideBar from "./SideBar/Sidebar"
import useStore from "../components/Zustand/Zustand";

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