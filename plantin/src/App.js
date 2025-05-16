import { useEffect, useState } from "react";
import "./App.css";
import Home from "./Webpages/Home";
import About from "./Webpages/About";
import Contact from "./Webpages/Contact";
import AdminLogin from "./Webpages/AdminLogin";
import { Route, Routes } from "react-router-dom";
import MainRouter from "./Webpages/MainRouter";
import PopupContext from "./Webpages/context/popupcontext";
import AccountContext from "./Webpages/context/Accountpopupcontext";
import Page from "./Webpages/404Page";
import Login from "./Webpages/Login";
import PostInDetail from "./Webpages/PostInDetail";
import Uploadloadpopup from "./Webpages/Uploadpopup";
import SignedUsers from "./Webpages/SignedUsers";
import LoggedUsers from "./Webpages/LoggedUsers";

import {
  LoginPrivateRoute,
  AdminPrivateRoute,
  LoginCheck,
  AdminLoginCheck,
} from "./Webpages/PrivateRoutes/PrivateRoute";
import Profile from "./Webpages/Profile";
import AdminPage from "./Webpages/AdminPage";
import axios from "axios";
import CategoryPost from "./Webpages/CategoryPost";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try {
      const sessionStorageToken = sessionStorage.getItem("ghasjdsbdnewiqyew");
      if (sessionStorageToken) {
        axios
          .post(`${process.env.REACT_APP_API_URL}/validate`, {
            sessionStorageToken,
          })
          .then((response) => {
            if (response.data.validToken.role === "user") {
              setIsLogin(true);
            } else if (response.data.validToken.role === "admin") {
              setIsAdmin(true);
            } else {
              setIsLogin(false);
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <PopupContext
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      isAdmin={isAdmin}
      setIsAdmin={setIsAdmin}
    >
      <AccountContext>
        <MainRouter />
      </AccountContext>
      <Routes>
        <Route path="*" element={<Page />} />
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/category/:id" element={<CategoryPost />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route element={<LoginCheck />}>
          <Route path="/login" element={<Login />}></Route>
        </Route>
        <Route element={<AdminLoginCheck />}>
          <Route path="/adminlogin" element={<AdminLogin />}></Route>
        </Route>
        <Route element={<LoginPrivateRoute />}>
          <Route path="/post/:id" element={<PostInDetail />}></Route>
          <Route path="/upload" element={<Uploadloadpopup />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/adminpage" element={<AdminPage />}></Route>
          <Route path="/signed/users" element={<SignedUsers />}></Route>
          <Route path="/logged/users" element={<LoggedUsers />}></Route>
        </Route>
      </Routes>
    </PopupContext>
  );
}
