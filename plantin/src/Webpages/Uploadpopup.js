import "./Uploadpopup.css";
import { FcAddImage, FcFile } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { PopupContextcreate } from "./context/popupcontext";

export default function Uploadpopup() {
  const navigate = useNavigate();
  const uploadbtn = useRef();
  const { categorys, setCategorys } = useContext(PopupContextcreate);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryExist, setCategoryExist] = useState(false);
  const uploader = sessionStorage.getItem("username");
  const loginschema = yup.object().shape({
    title: yup.string().required("Can't be empty!"),
    description: yup.string().required("Can't be empty!"),
    select: yup
      .string()
      .required("Can't be empty!")
      .test("Category", "Can't be empty!", (value) => {
        return value && value !== "Category";
      }),
    uploadimage: yup
      .mixed()
      .required()
      .test("UploadImage", "Can't be empty!", (value) => {
        return value && value.length !== 0;
      }),
    uploadfile: yup.mixed(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginschema),
  });

  const imageupload = async (image) => {
    try {
      const imageData = new FormData();
      imageData.append("file", image);
      imageData.append("tags", `codeinfuse,medium,gist`);
      imageData.append("upload_preset", "PlantIn_PostImages");
      imageData.append("api_key", "966231756931155");
      imageData.append("timestamp", (Date.now() / 1000) | 0);
      return axios
        .post(
          "https://api.cloudinary.com/v1_1/dbcy4xepe/image/upload",
          imageData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          sessionStorage.setItem("imageurl", response.data.secure_url);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const uploadfunction = async (data) => {
    try {
      uploadbtn.current.setAttribute("disabled", "disabled");
      uploadbtn.current.style.opacity = "50%";
      await imageupload(data.uploadimage[0]);
      const userid = jwt_decode(sessionStorage.getItem("ghasjdsbdnewiqyew"));
      const imageurl = sessionStorage.getItem("imageurl");
      if (data.uploadfile.length !== 0) {
        try {
          const fileData = new FormData();
          fileData.append("file", data.uploadfile[0]);
          fileData.append("tags", `codeinfuse,medium,gist`);
          fileData.append("upload_preset", "PlantIn_PostFiles");
          fileData.append("api_key", "966231756931155");
          fileData.append("timestamp", (Date.now() / 1000) | 0);
          return axios
            .post(
              "https://api.cloudinary.com/v1_1/dbcy4xepe/raw/upload",
              fileData,
              {
                headers: { "X-Requested-With": "XMLHttpRequest" },
              }
            )
            .then((response) => {
              axios
                .post(`${process.env.REACT_APP_API_URL}/upload`, {
                  userid: userid.id,
                  uploader,
                  role: userid.role,
                  title: data.title,
                  description: data.description,
                  category: data.select,
                  imageurl,
                  fileurl: response.data.secure_url,
                })
                .then((response) => {
                  sessionStorage.removeItem("imageurl");
                  response.data.success && navigate("/");
                });
              uploadbtn.current.removeAttribute("disabled");
              uploadbtn.current.style.opacity = "100%";
            });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          axios
            .post(`${process.env.REACT_APP_API_URL}/upload`, {
              userid: userid.id,
              uploader,
              role: userid.role,
              title: data.title,
              description: data.description,
              category: data.select,
              imageurl,
            })
            .then((response) => {
              sessionStorage.removeItem("imageurl");
              response.data.success && navigate("/profile");
            });
          uploadbtn.current.removeAttribute("disabled");
          uploadbtn.current.style.opacity = "100%";
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [bottom, setBottom] = useState("252px");

  useEffect(() => {
    if (
      (errors.title &&
        errors.description &&
        errors.select &&
        errors.uploadimage) ||
      (!errors.title &&
        errors.description &&
        errors.select &&
        errors.uploadimage) ||
      (!errors.title &&
        !errors.description &&
        errors.select &&
        errors.uploadimage) ||
      (errors.title &&
        !errors.description &&
        errors.select &&
        errors.uploadimage)
    ) {
      setBottom("295px");
    } else if (
      (!errors.title &&
        !errors.description &&
        !errors.select &&
        errors.uploadimage) ||
      (errors.title &&
        errors.description &&
        !errors.select &&
        errors.uploadimage) ||
      (errors.title &&
        errors.description &&
        errors.select &&
        !errors.uploadimage) ||
      (errors.title &&
        !errors.description &&
        !errors.select &&
        errors.uploadimage) ||
      (errors.title &&
        !errors.description &&
        errors.select &&
        !errors.uploadimage) ||
      (!errors.title &&
        errors.description &&
        errors.select &&
        !errors.uploadimage) ||
      (!errors.title &&
        !errors.description &&
        errors.select &&
        !errors.uploadimage)
    ) {
      setBottom("274px");
    } else {
      setBottom("252px");
    }
    // eslint-disable-next-line
  }, [loginschema]);

  useEffect(() => {
    try {
      axios.get(`${process.env.REACT_APP_API_URL}/category/fetch`).then((response) => {
        setCategorys(response.data);
      });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="uploadpopupcontainer">
      <div className="uploadform">
        <form onSubmit={handleSubmit(uploadfunction)} autoComplete="off">
          <label className="formlabel">Title</label>
          <input type="text" className="forminput" {...register("title")} />
          <p>{errors.title?.message}</p>
          <label className="formlabel">Description</label>
          <textarea
            placeholder="Write a detailed description"
            {...register("description")}
          ></textarea>
          <p>{errors.description?.message}</p>
          <select
            className="uploadcategory"
            defaultValue={"Category"}
            {...register("select")}
          >
            <option value="Category" disabled>
              Category
            </option>
            {categorys.slice(1).map((data) => (
              <option key={data._id}>{data.category}</option>
            ))}
          </select>
          {!isOpen && (
            <input
              type="button"
              className="addcategory"
              onClick={() => setIsOpen(true)}
              value="Add a category"
            />
          )}
          <p>{errors.select?.message}</p>
          <label htmlFor="image" className="upload">
            <FcAddImage size={50} />
            <p>Upload Image</p>
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register("uploadimage")}
            style={{ display: "none" }}
          ></input>
          <p>{errors.uploadimage?.message}</p>
          <br />
          <label htmlFor="file" className="upload">
            <FcFile size={50} />
            <p>Upload File</p>
          </label>
          <input
            type="file"
            id="file"
            {...register("uploadfile")}
            style={{ display: "none" }}
          />
          <input
            type="submit"
            value="Upload"
            className="uploadbtn"
            ref={uploadbtn}
          />
          <input
            type="button"
            className="cancelbtn"
            value="Cancel"
            onClick={() => navigate(-1)}
          />
        </form>
        {isOpen && (
          <Formik
            initialValues={{ addcategory: "" }}
            validationSchema={yup.object({
              addcategory: yup.string().required("Can't be empty!"),
            })}
            onSubmit={async (addCategory, { resetForm }) => {
              const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/category/add`,
                {
                  addcategory: addCategory.addcategory,
                }
              );
              if (response.data.success) {
                setCategorys(response.data.success);
                resetForm({ addcategory: "" });
                setIsOpen(false);
              } else {
                setCategoryExist(true);
                setTimeout(() => setCategoryExist(false), 3000);
              }
            }}
          >
            {(formik) => (
              <form
                onSubmit={formik.handleSubmit}
                autoComplete="off"
                style={{
                  width: "max-content",
                  height: "61px",
                  position: "relative",
                  left: "135px",
                  bottom: bottom,
                }}
              >
                <input
                  type="text"
                  name="addcategory"
                  className="addcategoryinput"
                  placeholder="Add a category..."
                  value={formik.values.addcategory}
                  onChange={formik.handleChange}
                />
                <br />
                {formik.errors.addcategory && (
                  <p className="categoryerror">{formik.errors.addcategory}</p>
                )}
                {categoryExist && (
                  <p className="categoryerror">Already Exist</p>
                )}
                <input
                  type="submit"
                  value="Add"
                  className="addcategorysubmit"
                />
                <input
                  type="button"
                  value="Cancel"
                  className="addcategorycancel"
                  onClick={() => setIsOpen(false)}
                />
              </form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
