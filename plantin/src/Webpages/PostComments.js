import { useEffect, useState } from "react";
import "./PostComments.css";
import { FcComments } from "react-icons/fc";
import * as yup from "yup";
import { BsPersonCircle } from "react-icons/bs";
import { Formik } from "formik";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { PostCommentsEdit, PostCommentsReplayEdit } from "./PostCommentsEdit";

export default function PostComments({ id }) {
  const [update, setUpdate] = useState();
  const userid = jwt_decode(sessionStorage.getItem("ghasjdsbdnewiqyew"));
  const username = sessionStorage.getItem("username");
  const [postComments, setPostComments] = useState([]);
  const [commentId, setCommentId] = useState("");
  const [replay, setReplay] = useState([]);
  const [commentsReplay, setCommentsReplay] = useState([]);

  const fetchReplays = async (commentid) => {
    try {
      const response = replay.filter(
        (replayitem) => replayitem.commentid === commentid
      );
      setCommentsReplay(response);
    } catch (err) {
      console.log(err);
    }
  };

  const commentsfetch = async () => {
    try {
      const response = await axios.get(
        `https://plantin-api-didheemose.vercel.app/post/comments/fetch/${id}`
      );
      setPostComments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const repliesfetch = async () => {
    try {
      const response = await axios.get(
        `https://plantin-api-didheemose.vercel.app/post/comments/replays/fetch/${id}`
      );
      setReplay(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const commentDelete = async (id, postid) => {
    try {
      const response = await axios.post(
        "https://plantin-api-didheemose.vercel.app/post/comments/delete",
        {
          id,
          postid,
        }
      );
      setPostComments(response.data);
      repliesfetch();
    } catch (err) {
      console.log(err);
    }
  };

  const repliesDelete = async (id, commentid) => {
    try {
      const response = await axios.post(
        "https://plantin-api-didheemose.vercel.app/post/comments/replays/delete",
        {
          id,
          commentid,
        }
      );
      setCommentsReplay(response.data);
      repliesfetch();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    commentsfetch();
    repliesfetch();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="comments">
      <Formik
        initialValues={{ comment: "" }}
        validationSchema={yup.object({
          comment: yup.string().required(),
        })}
        onSubmit={(data, { resetForm }) => {
          axios
            .post("https://plantin-api-didheemose.vercel.app/post/comments", {
              postid: id,
              userid: userid.id,
              username,
              comments: data.comment,
            })
            .then((response) => {
              setPostComments(response.data);
            });
          resetForm({ data: "" });
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <FcComments size={40} />
            <input
              name="comment"
              className="commentinput"
              type="text"
              placeholder="Add a comment..."
              onChange={formik.handleChange}
              value={formik.values.comment}
            />
            <input type="submit" value="Comment" className="submitbtn" />
          </form>
        )}
      </Formik>
      {postComments.map((data) => (
        <div key={data._id} className="postedcomments">
          <BsPersonCircle size={30} />
          <div>
            <div className="username">{data.username}</div>
            {update === data._id ? (
              <PostCommentsEdit
                value={data.comments}
                setUpdate={setUpdate}
                commentid={update}
                postid={data.postid}
                setPostComments={setPostComments}
              />
            ) : (
              <div>{data.comments}</div>
            )}
            {data.userid === userid.id && (
              <button
                className="commentbtn"
                onClick={() => {
                  setUpdate(data._id);
                }}
              >
                Edit
              </button>
            )}
            {(data.userid === userid.id || userid.role === "admin") && (
              <button
                className="commentbtn"
                onClick={() => {
                  commentDelete(data._id, data.postid);
                }}
              >
                Delete
              </button>
            )}
            {data._id !== commentId ? (
              <button
                className="replaybtn"
                onClick={() => {
                  setCommentId(data._id);
                  fetchReplays(data._id);
                }}
              >
                <AiFillCaretDown className="icons" />
                replies
              </button>
            ) : (
              <button
                className="replaybtn"
                onClick={() => {
                  setCommentId("");
                  setCommentsReplay([]);
                }}
              >
                <AiFillCaretUp className="icons" />
                replies
              </button>
            )}
            {data._id === commentId && (
              <div>
                <Formik
                  initialValues={{ replay: "" }}
                  validationSchema={yup.object({
                    replay: yup.string().required(),
                  })}
                  onSubmit={async (replay, { resetForm }) => {
                    const response = await axios.post(
                      "https://plantin-api-didheemose.vercel.app/post/comments/replays",
                      {
                        postid: data.postid,
                        commentid: data._id,
                        userid: userid.id,
                        username,
                        replay: replay.replay,
                      }
                    );
                    setCommentsReplay(response.data);
                    repliesfetch();
                    resetForm({ replay: "" });
                  }}
                >
                  {(formik) => (
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                      <input
                        name="replay"
                        type="text"
                        className="replayinput"
                        placeholder="Add a reply..."
                        onChange={formik.handleChange}
                        value={formik.values.replay}
                      />
                      <input
                        type="submit"
                        value="Replay"
                        className="replaysubmitbtn"
                      />
                    </form>
                  )}
                </Formik>
                {commentsReplay.map((data) => (
                  <div key={data._id} className="replaycomments">
                    <BsPersonCircle size={30} className="icons" />
                    <div>
                      <div className="username">{data.username}</div>
                      <div>
                        {update === data._id ? (
                          <PostCommentsReplayEdit
                            value={data.replay}
                            setUpdate={setUpdate}
                            replayid={update}
                            commentid={data.commentid}
                            setCommentsReplay={setCommentsReplay}
                            repliesfetch={repliesfetch}
                          />
                        ) : (
                          <div>{data.replay}</div>
                        )}
                      </div>
                      {data.userid === userid.id && (
                        <button
                          className="replaybtn"
                          onClick={() => setUpdate(data._id)}
                        >
                          Edit
                        </button>
                      )}
                      {(data.userid === userid.id ||
                        userid.role === "admin") && (
                        <button
                          className="replaybtn"
                          onClick={() => {
                            repliesDelete(data._id, data.commentid);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <br />
          </div>
        </div>
      ))}
    </div>
  );
}
