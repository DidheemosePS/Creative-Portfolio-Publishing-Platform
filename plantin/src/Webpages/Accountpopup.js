import { Link, useNavigate } from "react-router-dom";
import "./Accountpopupcss.css";
import { BiChevronRight } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { AccountContextcreate } from "./context/Accountpopupcontext";
import { useContext } from "react";
import { PopupContextcreate } from "./context/popupcontext";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function Accountpopup() {
  const { menudrop } = useContext(AccountContextcreate);
  const { isLogin, setIsLogin, isAdmin, setIsAdmin } =
    useContext(PopupContextcreate);
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const loginstatus = async () => {
    const decode = jwt_decode(sessionStorage.getItem("ghasjdsbdnewiqyew"));
    await axios.post("https://plantin-api-didheemose.vercel.app/logout", {
      id: decode.id,
    });
  };
  return (
    <div className="accountpopupmain" ref={menudrop}>
      <div className="useraccount">
        <BsPersonCircle size={25} className="useraccounticon" />
        {username ? <>{username}</> : <>Username</>}
      </div>
      <div className="navpages">
        {isAdmin ? (
          <>
            <Link to="/signed/users" className="navpageslink">
              Signed Users
              <BiChevronRight className="arrowicon" />
            </Link>
            <Link to="/logged/users" className="navpageslink">
              Logged Users
              <BiChevronRight className="arrowicon" />
            </Link>
            <Link to="/AdminPage" className="navpageslink">
              Users Post
              <BiChevronRight className="arrowicon" />
            </Link>
          </>
        ) : null}
        <Link to="/profile" className="navpageslink">
          Profile
          <BiChevronRight className="arrowicon" />
        </Link>
        <Link to="/about" className="navpageslink">
          About
          <BiChevronRight className="arrowicon" />
        </Link>
        <Link to="/contact" className="navpageslink">
          Contact
          <BiChevronRight className="arrowicon" />
        </Link>
        {isLogin || isAdmin ? (
          <Link
            to="/"
            onClick={() => {
              isLogin && loginstatus();
              sessionStorage.clear();
              setIsLogin(false);
              setIsAdmin(false);
              navigate("/");
            }}
            className="navpageslink"
          >
            Logout <BiChevronRight className="arrowicon" />
          </Link>
        ) : (
          <Link to="/login" className="navpageslink">
            Login <BiChevronRight className="arrowicon" />
          </Link>
        )}
      </div>
    </div>
  );
}
