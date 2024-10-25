import React from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Signup from './components/signup'
import Login from "./components/login";
import Dashboard from './components/dashboard'
import AssetViewer from './components/AssetViewer'
function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/AssetViewer" element={<AssetViewer/>}/>

    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
