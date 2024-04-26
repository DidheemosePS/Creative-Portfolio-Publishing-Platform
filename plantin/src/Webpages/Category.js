import { useContext, useEffect } from "react";
import "./Category.css";
import axios from "axios";
import { PopupContextcreate } from "./context/popupcontext";
import { MdDeleteOutline } from "react-icons/md";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const { categorys, setCategorys, categoryfun } =
    useContext(PopupContextcreate);
  const token = sessionStorage.getItem("ghasjdsbdnewiqyew");
  const navigate = useNavigate()
  const deletecategory = async (categoryid, categoryname) => {
    try {
      const response = await axios.post(
        "https://plantin-api-didheemose.vercel.app/category/delete",
        {
          categoryid,
          categoryname
        }
      );
      setCategorys(response.data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      axios.get("https://plantin-api-didheemose.vercel.app/category/fetch").then((response) => {
        setCategorys(response.data);
      });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="maincategory">
      <div className="category">
        {categorys.slice(0, 1).map((data) => (
          <button
            className="categorybutton"
            key={data._id}
            onClick={() => categoryfun(data.category)}
          >
            {data.category}
          </button>
        ))}
        {categorys.slice(1).map((data) => (
          <div className="categorymap" key={data._id}>
            <button
              className="categorybutton"
              onClick={() => categoryfun(data.category)}
            >
              {data.category}
            </button>
            {token && jwt_decode(token).role === "admin" && (
              <button
                className="categorydeletebtn"
                onClick={() => deletecategory(data._id, data.category)}
              >
                <MdDeleteOutline size={20} className="icons" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
