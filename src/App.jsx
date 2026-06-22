import Home from "./components/Home/Home";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import CapitalHumano from "./pages/CapitalHumano/CapitalHumano";
import Reclamos from "./pages/EstadisticasReclamos/Reclamos";
import PrivateRoute from "./routes/PrivateRoute";
import PanelAdmin from "./components/Admin/General/PanelAdmin";
import PanelContratacion from "./components/Admin/Contratacion/PanelContratacion";
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
import SuccessPage from "./components/BotonDePagoMacro/SuccessPage";
import ErrorPage from "./components/BotonDePagoMacro/ErrorPage";
import Montos from "./components/TribunalDeFaltas/Montos";
import Multas from "./pages/Multas/Multas";
import FormularioBusquedaUsuario from "./components/ValidarUsuarios/FormularioBusquedaUsuario";
import Solicitud_permisos from "./pages/ViaPublica/Solicitud_permisos";
import GasATuCasa from "./components/GasATuCasa/GasATuCasa";
import PanelPersonasGas from "./pages/ElGasLlegaATuCasaBackOffice/PanelPersonasGas";
import ProviderDerivador from "./context/DerivadorContext";
import PrivateRouteUsuarios from "./routes/PrivateRouteUsuarios";
import CargarExcel from "./components/Combustibles/ImportarExcel";
import ConsumosTable from "./components/Combustibles/verDatosCargados";
import VehiculosTable from "./components/Combustibles/verDatosVehiculos";
import MenuCombustibles from "./components/Combustibles/MenuCombustibles";
import DashboardSistemas from "./pages/DashboardSistemas/DashboardSistemas";

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
  // url.searchParams.delete("auth");
  history.replaceState(null, "", url.toString());

  if (logout) {
    localStorage.removeItem("token");
  }
  return (
    <>
      <HashRouter>
        <Layout>
          <ProviderDerivador>
            <Routes>
              <Route exact path="/*" element={<PrivateRoute key="home"><Home /></PrivateRoute>} />
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
              <Route exact path="/dashboard-sistemas" element={<PrivateRouteAdmin><DashboardSistemas /></PrivateRouteAdmin>} />
              <Route exact path="/validar_usuarios" element={<PrivateRouteUsuarios key="validar_usuarios"><FormularioBusquedaUsuario /></PrivateRouteUsuarios>} />
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

              {/* BOTON DE PAGO */}
              <Route exact path="/LibreDeudaPagoExitoso" element={<PrivateRoute key="success"><SuccessPage/></PrivateRoute>} />
              <Route exact path="/LibreDeudaPagoRechazado" element={<PrivateRoute key="errorPago"><ErrorPage/></PrivateRoute>} />
              <Route exact path="/montos" element={<PrivateRoute key="montos"><Montos/></PrivateRoute>} />

              <Route exact path="/multas" element={<PrivateRoute key="multas"><Multas/></PrivateRoute>} />
              
              {/* VIA PUBLICA */}
              <Route exact path="/via-publica" element={<PrivateRoute key="via-publica"><Solicitud_permisos/></PrivateRoute>} />

              {/* OBRAS PUBLICAS */}
              <Route exact path="/el-gas-llega-a-tu-casa" element={<PrivateRoute key="elGasATuCasa"><GasATuCasa /></PrivateRoute>} />
              <Route exact path="/el-gas-a-tu-casa-backoffice" element={<PrivateRoute key="elGasATuCasaBackOffice"><PanelPersonasGas /></PrivateRoute>} />

              {/* COMBUSTIBLES */}
              <Route exact path="/importarExcelCombustibles" element={<PrivateRoute key="importarExcel"><CargarExcel /></PrivateRoute>} />
              <Route exact path="/leerDatosCombustibles" element={<PrivateRoute key="VerConsumosCombustibles"><ConsumosTable /></PrivateRoute>} />
              <Route exact path="/leerDatosVehiculos" element={<PrivateRoute key="vehiculosCombustibles"><VehiculosTable /></PrivateRoute>} />
              <Route exact path="/menuCombustibles" element={<PrivateRoute key="menuCombustibles"><MenuCombustibles/></PrivateRoute>} />

            </Routes>
          </ProviderDerivador>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
