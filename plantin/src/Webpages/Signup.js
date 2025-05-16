import { useRef, useState } from "react";
import "./Signup.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Signup({ bcklogin }) {
  const [user, setUser] = useState(false);
  const signupbtn = useRef();

  if (user) {
    setTimeout(() => setUser(false), 3000);
  }

  const signupschema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Email is not valid"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf(
        [yup.ref("password")],
        "Password and Confirm Password does not match"
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupschema),
  });

  const signupfunction = async (data) => {
    try {
      signupbtn.current.setAttribute("disabled", "disabled");
      signupbtn.current.style.opacity = "50%";
      await axios
        .post(`${process.env.REACT_APP_API_URL}/signup`, data)
        .then((response) => {
          response.data === "Success" ? bcklogin(true) : setUser(true);
        });
      signupbtn.current.removeAttribute("disabled");
      signupbtn.current.style.opacity = "100%";
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="signupcontainer">
      <center>
        <br />
        <h2>Sign up</h2>
        <br />
      </center>
      <form onSubmit={handleSubmit(signupfunction)} autoComplete="off">
        <div>
          <label>Name</label>
          <input type="text" {...register("name")} />
          <p>{errors.name?.message}</p>
        </div>
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
        <div>
          <label>Confirm Password</label>
          <input type="password" {...register("confirmPassword")} />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <input type="submit" className="sgnbtn" ref={signupbtn} />
      </form>
      {user && <p className="useralrdyex">User already exist</p>}
    </div>
  );
}
