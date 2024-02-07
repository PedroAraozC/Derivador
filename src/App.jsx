import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import CapitalHumano from "./pages/CapitalHumano/CapitalHumano";
import Reclamos from "./pages/EstadisticasReclamos/Reclamos";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <>
    <HashRouter>
        <Layout>
          <Routes>
            <Route exact path="/*" element={<Login />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact
              path="/cap-humano"
              element={
                <PrivateRoute>
                  <CapitalHumano />
                </PrivateRoute>
              }
            />
            <Route exact
              path="/reclamos-estadisticas"
              element={
                <PrivateRoute>
                  <Reclamos />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
