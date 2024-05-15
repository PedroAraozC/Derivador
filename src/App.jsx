import Login from "./components/Login/Login";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Registro } from "./components/Registro/Registro";

function App() {
  const url = new URL(window.location.href);
  const logout = url.searchParams.get("logout");

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const reparti = params.get('rep');
  localStorage.setItem("reparticion", reparti? reparti : 1711);

  url.searchParams.delete("logout");
  history.replaceState(null, '', url.toString());

  if(logout){
    localStorage.removeItem("token");
  }
  return (
    <>
    <HashRouter>
      
          <Routes>
            <Route exact path="/*" element={<Registro />} />
            {/* <Route exact path="/registro" element={<Registro />} />  */}
          </Routes>
      
      </HashRouter>
    </>
  );
}

export default App;
