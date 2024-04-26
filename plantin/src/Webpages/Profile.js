import { useEffect, useState, useRef } from "react";
import "./Profile.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import ProfileEdit from "./ProfileEdit";
import notFoundimage from "./Images/notFound.png";
import { DeleteAlertBoxs } from "./AlertBoxs";
import { BsPersonCircle } from "react-icons/bs";

export default function Profile() {
  const navigate = useNavigate();
  const deletebtn = useRef();
  const accessToken = sessionStorage.getItem("ghasjdsbdnewiqyew");
  const decoded = jwt_decode(accessToken);
  const [profileData, setProfileData] = useState([]);
  const [sortProfileData, setSortProfileData] = useState();
  const [notFound, setnotFound] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [postid, setPostid] = useState("");
  const deletefunction = async (id) => {
    try {
      await axios
        .post("https://plantin-api-didheemose.vercel.app/removepost", {
          id,
          userid: decoded.id,
        })
        .then((response) => {
          if (response.data.error) {
            setProfileData([]);
            setnotFound(true);
          } else {
            setProfileData(response.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      axios
        .get(`https://plantin-api-didheemose.vercel.app/profile/${decoded.id}`)
        .then((response) => {
          response.data.error
            ? setnotFound(true)
            : setProfileData(response.data);
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="profilepostmaincontainer">
        {profileData.map((data) => (
          <div key={data._id} className="profilemap">
            <div
              className="profilecardscontainer"
              onClick={() => navigate(`/post/${data._id}`)}
            >
              <div className="profilecardimage">
                <img
                  className="profileimage"
                  src={data.imageurl}
                  alt="Something went wrong"
                ></img>
              </div>
              <div className="username">
                <BsPersonCircle size={25} className="icons" />
                <p>{data.uploader}</p>
              </div>
              <div className="profilecardcontent">
                <div className="profilecardtitle">{data.title}</div>
                <p className="profilecarddescription">{data.description}</p>
              </div>
            </div>
            <button
              className="profileedtbtn"
              onClick={() => {
                const result = profileData.filter(
                  (catitem) => catitem._id === data._id
                );
                setSortProfileData(result);
              }}
            >
              <AiOutlineEdit size={15} className="icon" />
              Edit
            </button>
            <button
              className="profiledelebtn"
              ref={deletebtn}
              onClick={() => {
                setIsDelete(true);
                setPostid(data._id);
              }}
            >
              <MdDeleteForever size={15} className="icon" />
              Delete
            </button>
          </div>
        ))}
      </div>
      {sortProfileData && (
        <ProfileEdit
          sortProfileData={sortProfileData}
          setSortProfileData={setSortProfileData}
          profileData={profileData}
          setProfileData={setProfileData}
        />
      )}
      {notFound && (
        <div className="notFound">
          <div className="notFounddiv">
            <div className="imagediv">
              <img src={notFoundimage} alt="" />
            </div>
            <p>Nothing uploaded yet!</p>
          </div>
        </div>
      )}
      {isDelete && (
        <DeleteAlertBoxs
          setIsDelete={setIsDelete}
          postid={postid}
          setPostid={setPostid}
          deletefunction={deletefunction}
        />
      )}
    </>
  );
}
