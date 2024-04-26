import { useEffect, useState } from "react";
import "./Post.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import Category from "./Category";

export default function Post() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const shuffle = (arrayData) => {
    const shuffledArray = [];
    const usedIndexes = [];
    let i = 0;
    while (i < arrayData.length) {
      const randomNumber = Math.floor(Math.random() * arrayData.length);
      if (!usedIndexes.includes(randomNumber)) {
        shuffledArray.push(arrayData[randomNumber]);
        usedIndexes.push(randomNumber);
        i++;
      }
    }
    setResults((oldResults) => [...oldResults, ...shuffledArray]);
  };

  let skip = 0;
  const loadmore = () => {
    try {
      axios.post("https://plantin-api-didheemose.vercel.app/", { skip }).then((response) => {
        shuffle(response.data);
      });
      skip += 10;
    } catch (err) {
      console.log(err);
    }
  };

  const handlescroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 1 >=
      e.target.documentElement.scrollHeight
    ) {
      loadmore();
    }
  };

  useEffect(() => {
    try {
      loadmore();
      window.addEventListener("scroll", handlescroll);
      return () => {
        window.removeEventListener("scroll", handlescroll);
        setResults([]);
      };
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Category />
      <div className="postmaincontainer">
        {results.map((data) => (
          <div onClick={() => navigate(`/post/${data._id}`)} key={data._id}>
            <div className="cardscontainer">
              <div className="cardimage">
                <img
                  className="image"
                  src={data.imageurl}
                  alt="Something went wrong"
                ></img>
              </div>
              <div className="username">
                <BsPersonCircle size={25} className="icons" />
                <p>{data.uploader}</p>
              </div>
              <div className="cardcontent">
                <div className="cardtitle">{data.title}</div>
                <div className="carddescription">{data.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
