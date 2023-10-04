// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import ForgetPassword from "./pages/forgetPassword.tsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
