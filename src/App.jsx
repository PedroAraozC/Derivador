import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import CapitalHumano from "./pages/CapitalHumano/CapitalHumano";
import Reclamos from "./pages/EstadisticasReclamos/Reclamos";
import PrivateRoute from "./routes/PrivateRoute";
import Perfil from "./pages/Perfil/Perfil";
import { Registro } from "./components/Registro/Registro";
import PanelAdmin from "./components/Admin/PanelAdmin";
import PanelContratacion from "./components/Admin/Contratacion/PanelContratacion";
import Licitaciones from "./components/Licitaciones/Licitaciones";
import Licitacion from "./components/Licitaciones/Licitacion";
import PanelEducacion from "./components/Admin/Educacion/PanelEducacion";
import AgregarEstablecimiento from "./components/Admin/Educacion/Establecimientos/AgregarEstablecimiento";
import AgregarCaracter from "./components/Admin/Educacion/Caracter/AgregarCaracter";
import AgregarCausal from "./components/Admin/Educacion/Causal/AgregarCausal";
import AgregarConvocatoria from "./components/Admin/Educacion/Convocatorias/AgregarConvocatoria";
import ProviderEducacion from "./context/EducaContext";

function App() {
  const url = new URL(window.location.href);
  const logout = url.searchParams.get("logout");

  url.searchParams.delete("logout");
  history.replaceState(null, '', url.toString());

  if (logout) {
    localStorage.removeItem("token");
  }
  return (
    <>
      <HashRouter>
        <Layout>
          <ProviderEducacion>
            <Routes>
              <Route exact path="/*" element={<Login />} />
              <Route exact path="/home" element={<PrivateRoute key="home"><Home /></PrivateRoute>} />
              <Route exact path="/registro" element={<Registro />} />
              <Route exact
                path="/estadistica_rrhh"
                element={
                  <PrivateRoute key="cap-humano">
                    <CapitalHumano />
                  </PrivateRoute>
                }
              />
              <Route exact
                path="/estadistica_ac"
                element={
                  <PrivateRoute key="reclamos">
                    <Reclamos />
                  </PrivateRoute>
                }
              />

              <Route exact path="/perfil" element={
                <PrivateRoute><Perfil /></PrivateRoute>
              } />

              <Route exact path="/panel_admin" element={<PanelAdmin />} />
              
              {/* LICITACION */}
              <Route exact path="/panel_contratacion" element={<PanelContratacion />} />
              {/* LICITACION */}

              {/* EDUCACION */}
              <Route exact path="/panel_educacion" element={<PanelEducacion />} />
              <Route exact path="/agregar-establecimiento" element={<AgregarEstablecimiento />} />
              <Route exact path="/agregar-caracter" element={<AgregarCaracter />} />
              <Route exact path="/agregar-causal" element={<AgregarCausal />} />
              <Route exact path="/agregar-convoca" element={<AgregarConvocatoria />} />
              {/* EDUCACION */}

              <Route exact path="/licitaciones_concursos" element={<Licitaciones />} />
              <Route path="/licitacion/:id" element={<Licitacion />} />
            </Routes>
          </ProviderEducacion>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
