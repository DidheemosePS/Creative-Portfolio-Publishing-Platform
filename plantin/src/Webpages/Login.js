import { useContext, useState, useRef } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Signup from "./Signup";
import jwt_decode from "jwt-decode";
import { PopupContextcreate } from "./context/popupcontext";

export default function Login() {
  const { setIsLogin, setIsAdmin } = useContext(PopupContextcreate);
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);
  const [login, setLogin] = useState(true);
  const loginbtn = useRef();

  if (invalid) {
    setTimeout(() => setInvalid(false), 3000);
  }

  const loginschema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Email is not valid"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginschema),
  });

  const loginfunction = async (data) => {
    try {
      loginbtn.current.setAttribute("disabled", "disabled");
      loginbtn.current.style.opacity = "50%";
      await axios
        .post(`${process.env.REACT_APP_API_URL}/login`, data)
        .then((response) => {
          if (response.data.error) {
            setInvalid(true);
          } else {
            sessionStorage.setItem("ghasjdsbdnewiqyew", response.data);
            const decoded = jwt_decode(
              sessionStorage.getItem("ghasjdsbdnewiqyew")
            );
            sessionStorage.setItem("username", decoded.username);
            setIsLogin(true);
            setIsAdmin(false);
            navigate("/");
          }
        });
      loginbtn.current.removeAttribute("disabled");
      loginbtn.current.style.opacity = "100%";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="loginsignupcontainer">
      <div className="btncontainer">
        <button className="loginbtn" onClick={() => setLogin(true)}>
          login
        </button>
        <button className="signupbtn" onClick={(e) => setLogin(false)}>
          Sign Up
        </button>
      </div>
      {login ? (
        <div className="logincontainer">
          <center>
            <br />
            <h2>Login</h2>
            <br />
          </center>
          <form onSubmit={handleSubmit(loginfunction)} autoComplete="off">
            <div>
              <label>Email</label>
              <input type="text" {...register("email")} />
              <p>{errors.email?.message}</p>
            </div>
            <div>
              <label>Password</label>
              <input type="password" {...register("password")} />
              <p>{errors.password?.message}</p>
            </div>
            <input
              className="lgnbtn"
              type="submit"
              value="Login"
              ref={loginbtn}
            />
          </form>
          {invalid && <p className="usernotfound">User not found</p>}
        </div>
      ) : (
        <Signup bcklogin={setLogin} />
      )}
    </div>
  );
}
