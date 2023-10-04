// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import ForgetPassword from "./pages/forgetPassword.tsx";
import SubmitCod from "./pages/submitCod.tsx";
import NewPassword from "./pages/newPassword.tsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/submitCod" element={<SubmitCod />} />
          <Route path="/newPassword" element={<NewPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
