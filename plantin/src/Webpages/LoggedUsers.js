import React, { useEffect, useState } from "react";
import "./LoggedUsers.css";
import axios from "axios";
export default function LoggedUsers() {
  const [loggedUsers, setLoggedUser] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/logged/users`).then((response) => {
      setLoggedUser(response.data);
    });
  }, []);

  return (
    <div className="loggeduserslist">
      <table border={1} className="loggedusers">
        <thead>
          <tr className="usersdetail">
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        {loggedUsers.map((users) => (
          <thead key={users._id}>
            <tr>
              <td className="usersdetail">{users.name}</td>
              <td className="usersdetail">{users.email}</td>
            </tr>
          </thead>
        ))}
      </table>
    </div>
  );
}
