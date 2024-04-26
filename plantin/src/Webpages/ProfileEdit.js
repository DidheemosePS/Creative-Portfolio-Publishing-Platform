import "./ProfileEdit.css";
import { FcAddImage, FcFile } from "react-icons/fc";
import "./Login.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwt_decode from "jwt-decode";
import { useRef, useContext, useEffect, useState } from "react";
import { PopupContextcreate } from "./context/popupcontext";
import { Formik } from "formik";

export default function ProfileEdit({
  sortProfileData,
  setSortProfileData,
  setProfileData,
}) {
  const uploadbtn = useRef();
  const editProfileData = sortProfileData[0];
  const { categorys, setCategorys } = useContext(PopupContextcreate);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryExist, setCategoryExist] = useState(false);

  const loginschema = yup.object().shape({
    title: yup.string().required("Can't be empty!"),
    description: yup.string().required("Can't be empty!"),
    select: yup
      .string()
      .required("Can't be empty!")
      .test("Category", "Can't be empty!", (value) => {
        return value && value !== "Category";
      }),
    uploadfile: yup.mixed(),
    uploadimage: yup.mixed(),
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

  const updatefunction = async (data) => {
    try {
      uploadbtn.current.setAttribute("disabled", "disabled");
      uploadbtn.current.style.opacity = "50%";
      const userid = jwt_decode(sessionStorage.getItem("ghasjdsbdnewiqyew"));
      if (data.uploadimage.length === 0 && data.uploadfile.length !== 0) {
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
                .post("https://plantin-api-didheemose.vercel.app/editpost", {
                  postid: editProfileData._id,
                  userid: userid.id,
                  title: data.title,
                  description: data.description,
                  category: data.select,
                  updatefileurl: response.data.secure_url,
                })
                .then((response) => {
                  setProfileData(response.data);
                  response.data && setSortProfileData();
                });
            });
        } catch (err) {
          console.log(err);
        }
      } else if (
        data.uploadfile.length === 0 &&
        data.uploadimage.length !== 0
      ) {
        try {
          await imageupload(data.uploadimage[0]);
          const imageurl = sessionStorage.getItem("imageurl");
          axios
            .post("https://plantin-api-didheemose.vercel.app/editpost", {
              postid: editProfileData._id,
              userid: userid.id,
              title: data.title,
              description: data.description,
              category: data.select,
              updateimageurl: imageurl,
            })
            .then((response) => {
              setProfileData(response.data);
              sessionStorage.removeItem("imageurl");
              response.data && setSortProfileData();
            });
        } catch (err) {
          console.log(err);
        }
      } else if (
        data.uploadimage.length === 0 &&
        data.uploadfile.length === 0
      ) {
        try {
          axios
            .post("https://plantin-api-didheemose.vercel.app/editpost", {
              postid: editProfileData._id,
              userid: userid.id,
              title: data.title,
              description: data.description,
              category: data.select,
            })
            .then((response) => {
              setProfileData(response.data);
              response.data && setSortProfileData();
            });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await imageupload(data.uploadimage[0]);
          const imageurl = sessionStorage.getItem("imageurl");

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
                .post("https://plantin-api-didheemose.vercel.app/editpost", {
                  postid: editProfileData._id,
                  userid: userid.id,
                  title: data.title,
                  description: data.description,
                  category: data.select,
                  updateimageurl: imageurl,
                  updatefileurl: response.data.secure_url,
                })
                .then((response) => {
                  setProfileData(response.data);
                  sessionStorage.removeItem("imageurl");
                  response.data && setSortProfileData();
                });
            });
        } catch (err) {
          console.log(err);
        }
      }
      uploadbtn.current.removeAttribute("disabled");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      axios
        .get("https://plantin-api-didheemose.vercel.app/category/fetch")
        .then((response) => {
          setCategorys(response.data);
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="editform">
      <form onSubmit={handleSubmit(updatefunction)} autoComplete="off">
        <label className="formlabel">Title</label>
        <input
          type="text"
          className="forminput"
          defaultValue={editProfileData.title}
          {...register("title")}
        />
        <p>{errors.title?.message}</p>
        <label className="formlabel">Description</label>
        <textarea
          placeholder="Write a detailed description"
          defaultValue={editProfileData.description}
          {...register("description")}
        ></textarea>
        <p>{errors.description?.message}</p>
        <select
          className="editcategory"
          defaultValue={editProfileData.category}
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

        <label htmlFor="image" className="edit">
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
        <label htmlFor="file" className="edit">
          <FcFile size={50} />
          <p>Upload File</p>
        </label>
        <input
          type="file"
          id="file"
          {...register("uploadfile")}
          style={{ display: "none" }}
        />
        <p>{errors.uploadfile?.message}</p>
        <input
          type="submit"
          value="Upload"
          className="uploadbtn"
          ref={uploadbtn}
        />
        <input
          type="button"
          value="Cancel"
          className="cancelbtn"
          onClick={() => {
            setSortProfileData();
          }}
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
              "https://plantin-api-didheemose.vercel.app/category/add",
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
              setTimeout(() => setCategoryExist(false), 5000);
            }
          }}
        >
          {(formik) => (
            <form
              onSubmit={formik.handleSubmit}
              autoComplete="off"
              className="editaddcategory"
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
              {formik.errors.addcategory && <p>{formik.errors.addcategory}</p>}
              {categoryExist && <p>Already Exist</p>}
              <input type="submit" value="Add" className="addcategorysubmit" />
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
  );
}
