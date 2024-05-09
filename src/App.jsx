import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import CapitalHumano from "./pages/CapitalHumano/CapitalHumano";
import Reclamos from "./pages/EstadisticasReclamos/Reclamos";
import PrivateRoute from "./routes/PrivateRoute";
import Perfil from "./pages/Perfil/Perfil";
import { Registro } from "./components/Registro/Registro";

function App() {
  const url = new URL(window.location.href);
  const logout = url.searchParams.get("logout");

  url.searchParams.delete("logout");
  history.replaceState(null, '', url.toString());

  if(logout){
    localStorage.removeItem("token");
  }
  return (
    <>
    <HashRouter>
        <Layout>
          <Routes>
            <Route exact path="/*" element={<Login />} />
            <Route exact path="/home" element={<PrivateRoute key="home"><Home /></PrivateRoute>} />
            <Route exact path="/registro" element={<Registro />} />
            <Route exact
              path="/cap-humano"
              element={
                <PrivateRoute key="cap-humano">
                  <CapitalHumano />
                </PrivateRoute>
              }
            />
            <Route exact
              path="/reclamos-estadisticas"
              element={
                <PrivateRoute key="reclamos">
                  <Reclamos />
                </PrivateRoute>
              }
            />
            {/* <Route exact path="/perfil" element={
            <PrivateRoute><Perfil /></PrivateRoute>
            } /> */}
          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
