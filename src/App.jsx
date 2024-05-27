
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";

import PrivateRoute from "./routes/PrivateRoute";
import Perfil from "./pages/Perfil/Perfil";


function App() {
  const url = new URL(window.location.href);

  // AUTHENTICACION
  const token = url.searchParams.get("auth");
  const origin = url.searchParams.get("origin");
  url.searchParams.delete("auth");

  history.replaceState(null, '', url.toString());
  // Verificar si el token está presente en la URL y si aún no se ha guardado en el localStorage
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("origin", origin);
  } 
  else if (!token && localStorage.getItem("token") == null) {
    const url = new URL("https://smt.gob.ar/");
    window.location.href = url.toString();
  }
   return (
    <>
    <HashRouter>
        <Layout>
          <Routes>
         

            <Route exact path="/perfil" element={
            <PrivateRoute><Perfil /></PrivateRoute>
            } />

          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
