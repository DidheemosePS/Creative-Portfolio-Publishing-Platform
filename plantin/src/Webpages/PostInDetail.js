import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostInDetail.css";
import axios from "axios";
import PostComments from "./PostComments";
import { MdDownload } from "react-icons/md";

export default function PostInDetail() {
  const [value, setValue] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      axios.get(`${process.env.REACT_APP_API_URL}/post/${id}`).then((response) => {
        response.data.success ? setValue(response.data.post) : navigate("*");
      });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="postindetail">
      <div className="postindetailimagediv">
        <img src={value.imageurl} alt="" className="postindetailimage" />
      </div>
      <div className="postindetaildiv">
        <div className="postindetailtitle">{value.title}</div>
        <div className="postindetaildes">{value.description}</div>
        {value.fileurl && (
          <button
            onClick={() => window.open(`${value.fileurl}`, "_self")}
            className="postdownloadbtn"
          >
            <MdDownload size={20} />
            <p>Download</p>
          </button>
        )}
        <PostComments id={id} />
      </div>
    </div>
  );
}
