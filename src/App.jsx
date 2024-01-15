import Home from './components/Home/Home';
import Login from './components/Login/Login'
import ProviderCOM from './context/COMContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Layout from './common/Layout'
import CapitalHumano from './pages/CapitalHumano/CapitalHumano';


function App() {
  
  return (
    <>
    <Router>
        <Layout>
          <Routes>
            <Route
              path="/*"
              element={<Login/>}
            />
            <Route
              path="/home"
              element={<Home/>}
            />
            <Route
              path="/cap-humano"
              element={<CapitalHumano/>}
            />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App
