import React from "react";
import { Link } from "react-router-dom";

const Navigaion = ({ userObj }) => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="profile">{userObj.displayName}</Link>
      </li>
    </ul>
  </nav>
);

export default Navigaion;
