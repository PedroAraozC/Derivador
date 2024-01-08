import './App.css'
import Home from './components/Home/Home';
import Login from './components/Login/Login'
import ProviderCOM from './context/COMContext'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';


function App() {
  

  return (
    <>
    <Router>
      <ProviderCOM>
        {/* <Layout> */}
          <Routes>
            <Route
              path="/*"
              element={<Login/>}
            />
            <Route
              path="/home"
              element={<Home/>}
            />
          </Routes>
        {/* <Layout/> */}
      </ProviderCOM>
      </Router>
    </>
  )
}

export default App
