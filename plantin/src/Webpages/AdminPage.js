import { useState, useEffect } from "react";
import "./AdminPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { AdminDeleteAlertBoxs } from "./AlertBoxs";
import { BsPersonCircle } from "react-icons/bs";

export default function AdminPage() {
  const navigate = useNavigate();
  const [adminResults, setAdminResults] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [postid, setPostid] = useState("");

  const deletefunction = async (id) => {
    try {
      const response = await axios.post(
        "https://plantin-api-didheemose.vercel.app/admin/removepost",
        {
          id,
        }
      );
      setAdminResults(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      axios
        .get("https://plantin-api-didheemose.vercel.app/admin/fetchpost")
        .then((response) => {
          setAdminResults(response.data);
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="adminpostmaincontainer">
        {adminResults.map((data) => (
          <div key={data._id} className="adminmap">
            <div
              className="admincardscontainer"
              onClick={() => navigate(`/post/${data._id}`)}
            >
              <div className="admincardimage">
                <img
                  className="adminimage"
                  src={data.imageurl}
                  alt="Something went wrong"
                ></img>
              </div>
              <div className="username">
                <BsPersonCircle size={25} className="icons" />
                <p>{data.uploader}</p>
              </div>
              <div className="admincardcontent">
                <div className="admincardtitle">{data.title}</div>
                <div className="admincarddescription">{data.description}</div>
              </div>
            </div>
            <button
              className="admindelebtn"
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
      {isDelete && (
        <AdminDeleteAlertBoxs
          setIsDelete={setIsDelete}
          postid={postid}
          setPostid={setPostid}
          deletefunction={deletefunction}
        />
      )}
    </>
  );
}
