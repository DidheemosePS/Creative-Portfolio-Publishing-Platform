import { useContext, useState, useRef } from "react";
import "./AdminLogin.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { PopupContextcreate } from "./context/popupcontext";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function AdminLogin() {
  const { setIsAdmin, setIsLogin } = useContext(PopupContextcreate);
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);
  const adminloginbtn = useRef();

  if (invalid) {
    setTimeout(() => setInvalid(false), 3000);
  }

  const loginschema = yup.object().shape({
    adminId: yup.string().required("AdminID is required"),
    adminPassword: yup.string().required("AdminPassword is required"),
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
      adminloginbtn.current.setAttribute("disabled", "disabled");
      adminloginbtn.current.style.opacity = "50%";
      await axios
        .post("https://plantin-api-didheemose.vercel.app/AdminLogin", data)
        .then((response) => {
          if (response.data.error) {
            setInvalid(true);
          } else {
            sessionStorage.setItem("ghasjdsbdnewiqyew", response.data);
            const decoded = jwt_decode(
              sessionStorage.getItem("ghasjdsbdnewiqyew")
            );
            sessionStorage.setItem("username", decoded.adminname);
            setIsAdmin(true);
            setIsLogin(false);
            navigate("/AdminPage");
          }
        });
      adminloginbtn.current.removeAttribute("disabled");
      adminloginbtn.current.style.opacity = "100%";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin">
      <div className="adminlogincontainer">
        <center>
          <h2>Admin Login</h2>
          <br />
        </center>
        <form onSubmit={handleSubmit(loginfunction)} autoComplete="off">
          <div>
            <label>Admin ID</label>
            <input type="text" {...register("adminId")} />
            <p>{errors.adminId?.message}</p>
          </div>
          <div>
            <label>Password</label>
            <input type="password" {...register("adminPassword")} />
            <p>{errors.adminPassword?.message}</p>
          </div>
          <input
            type="submit"
            className="adminbtn"
            value="Login"
            ref={adminloginbtn}
          />
        </form>
        {invalid && <p className="accessdenied">Access Denied</p>}
      </div>
    </div>
  );
}
