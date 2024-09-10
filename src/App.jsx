import Home from "./components/Home/Home";
// import Login from "./components/Login/Login";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import CapitalHumano from "./pages/CapitalHumano/CapitalHumano";
import Reclamos from "./pages/EstadisticasReclamos/Reclamos";
import PrivateRoute from "./routes/PrivateRoute";
// import { Registro } from "./components/Registro/Registro";
import PanelAdmin from "./components/Admin/General/PanelAdmin";
import PanelContratacion from "./components/Admin/Contratacion/PanelContratacion";
import PanelEducacion from "./components/Admin/Educacion/PanelEducacion";
import AgregarEstablecimiento from "./components/Admin/Educacion/Establecimientos/AgregarEstablecimiento";
import AgregarCaracter from "./components/Admin/Educacion/Caracter/AgregarCaracter";
import AgregarCausal from "./components/Admin/Educacion/Causal/AgregarCausal";
import AgregarConvocatoria from "./components/Admin/Educacion/Convocatorias/AgregarConvocatoria";
import ProviderEducacion from "./context/EducaContext";
import PanelPatrimonioMunicipal from "./components/Admin/PatrimonioMunicipal/PanelPatrimonioMunicipal"
import AgregarAutor from "./components/Admin/PatrimonioMunicipal/Autor/AgregarAutor"
import AgregarPatrimonio from "./components/Admin/PatrimonioMunicipal/AgregarPatrimonio";
import AgregarEstado from "./components/Admin/PatrimonioMunicipal/Estado/AgregarEstado";
import AgregarMaterial from "./components/Admin/PatrimonioMunicipal/Material/AgregarMaterial";
import AgregarTipologia from "./components/Admin/PatrimonioMunicipal/Tipologia/AgregarTipologia";
import AgregarCategoria from "./components/Admin/PatrimonioMunicipal/Categoria/AgregarCategoria";
import AgregarUbicacion from "./components/Admin/PatrimonioMunicipal/Ubicacion/AgregarUbicacion";
import PanelGenero from "./components/Admin/Genero/PanelGenero";
import PanelTUsuarios from "./components/Admin/TiposUsuarios/PanelTUsuarios";
import PanelTDocumento from "./components/Admin/TipoDocumento/PanelTDocumento";
import PanelReparticiones from "./components/Admin/Reparticiones/PanelReparticiones";
import PermisosTUsuario from "./components/Admin/TiposUsuarios/PermisosTUsuario";
import PanelUsuarios from "./components/Admin/Usuarios/PanelUsuarios";
import PrivateRouteAdmin from "./routes/PrivateRouteAdmin";
// import PrivateRouteAdminLicitaciones from "./routes/PrivateRouteAdminLicitaciones";
// import PrivateRouteAdminPatrimonio from "./routes/PrivateRouteAdminPatrimonio";
// import PrivateRouteEmpleadoJerarquico from "./routes/PrivateRouteEmpleadoJerarquico";
// import PrivateRouteEducacion from "./routes/PrivateRouteEducacion";

function App() {
  const url = new URL(window.location.href);
  const logout = url.searchParams.get("logout");
  const token = url.searchParams.get("auth");

  if(localStorage.getItem("token")){
    localStorage.setItem("token", token != null ? token : localStorage.getItem("token"));
  }else if(token){
    localStorage.setItem("token", token);
  }

  url.searchParams.delete("logout");
  url.searchParams.delete("auth");
  history.replaceState(null, "", url.toString());

  if (logout) {
    localStorage.removeItem("token");
  }
  return (
    <>
      <HashRouter>
        <Layout>
          <ProviderEducacion>
            <Routes>
              {/* <Route exact path="/*" element={<Home/>} /> */}
              <Route exact path="/*" element={<PrivateRoute key="home"><Home /></PrivateRoute>} />
              {/* <Route exact path="/registro" element={<Registro />} /> */}
              <Route exact path="/estadistica_rrhh" element={<PrivateRoute key="cap-humano"><CapitalHumano /></PrivateRoute>}/>
              <Route exact path="/estadistica_ac" element={<PrivateRoute key="reclamos"><Reclamos /></PrivateRoute>}/>


              {/* ADMINISTRADOR GENERAL */}
              <Route exact path="/opcion" element={<PrivateRouteAdmin><PanelAdmin /></PrivateRouteAdmin>} />
              <Route exact path="/genero" element={<PrivateRouteAdmin><PanelGenero /></PrivateRouteAdmin>} />
              <Route exact path="/tipo-usuario" element={<PrivateRouteAdmin><PanelTUsuarios /></PrivateRouteAdmin>} />
              <Route exact path="/tipo_documento" element={<PrivateRouteAdmin><PanelTDocumento /></PrivateRouteAdmin>} />
              <Route exact path="/reparticion" element={<PrivateRouteAdmin><PanelReparticiones /></PrivateRouteAdmin>} />
              <Route exact path="/permisos-usuario" element={<PrivateRouteAdmin><PermisosTUsuario /></PrivateRouteAdmin>} />
              <Route exact path="/panel_usuario" element={<PrivateRouteAdmin><PanelUsuarios /></PrivateRouteAdmin>} />

              {/* ADMINISTRADOR GENERAL */}
              
              {/* LICITACION */}
              <Route exact path="/panel_contratacion" element={<PrivateRoute><PanelContratacion /></PrivateRoute>} />
              {/* LICITACION */}

              {/*PATRIMONIO*/ }
              <Route exact path="/panel_patrimonio" element={<PrivateRoute><PanelPatrimonioMunicipal /></PrivateRoute>} />
              <Route exact path="/agregar-patrimonio" element={<PrivateRoute><AgregarPatrimonio /></PrivateRoute>} />
              <Route exact path="/agregar-autor" element={<PrivateRoute><AgregarAutor /></PrivateRoute>} />
              <Route exact path="/agregar-estado" element={<PrivateRoute><AgregarEstado /></PrivateRoute>} />
              <Route exact path="/agregar-material" element={<PrivateRoute><AgregarMaterial /></PrivateRoute>} />
              <Route exact path="/agregar-tipologia" element={<PrivateRoute><AgregarTipologia /></PrivateRoute>} />
              <Route exact path="/agregar-categoria" element={<PrivateRoute><AgregarCategoria /></PrivateRoute>} />
              <Route exact path="/agregar-ubicacion" element={<PrivateRoute><AgregarUbicacion /></PrivateRoute>} />
              {/*PATRIMONIO*/ }


              {/* EDUCACION */}
              <Route exact path="/panel_educacion" element={<PrivateRoute><PanelEducacion /></PrivateRoute>} />
              <Route exact path="/agregar-establecimiento" element={<PrivateRoute><AgregarEstablecimiento /></PrivateRoute>} />
              <Route exact path="/agregar-caracter" element={<PrivateRoute><AgregarCaracter /></PrivateRoute>} />
              <Route exact path="/agregar-causal" element={<PrivateRoute><AgregarCausal /></PrivateRoute>} />
              <Route exact path="/agregar-convoca" element={<PrivateRoute><AgregarConvocatoria /></PrivateRoute>} />
              {/* EDUCACION */}

            </Routes>
          </ProviderEducacion>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
