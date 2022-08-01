import { authService } from "fBase";
import React from "react";
import { useHistory } from "react-router-dom";

export default () => {
  const history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  // Log Out 버튼을 눌렀을 때 Home 페이지로 되돌아가게 해줌
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
