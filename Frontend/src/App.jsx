import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import MainWrapper from "./layouts/MainWrapper";
import PrivateRoute from "./layouts/PrivateRoute";

import Register from "../src/views/auth/Register/Register";
import Login from "../src/views/auth/Login/Login";
import Logout from "../src/views/auth/Logout/Logout";
import ForgotPassword from "./views/auth/ForgotPassword/ForgotPassword";
import CreateNewPassword from "./views/auth/CreateNewPassword/CreateNewPassword";
import ChatPage from "./views/chat/ChatPage/ChatPage";

function App() {
  return (
        <BrowserRouter>
          <MainWrapper>
            <Routes>
              <Route path="/register/" element={<Register />} />
              <Route path="/login/" element={<Login />} />
              <Route path="/logout/" element={<Logout />} />
              <Route path="/forgot-password/" element={<ForgotPassword />} />
              <Route
                path="/create-new-password/"
                element={<CreateNewPassword />}
              />
              <Route path="/chat/" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            </Routes>
            {/* <Sidebar/>
            <Main/> */}
          </MainWrapper>
        </BrowserRouter>
  );
}

export default App
