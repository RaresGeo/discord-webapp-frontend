import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import actions from "../actions/";
import { useAppDispatch } from "../hooks";
import "../index.css";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const apiUrl = "http://localhost:3001";

  useEffect(() => {
    const asyncFetch = async () => {
      let url = window.location.href;
      let searchTerm = "?code=";
      let code = url.substring(url.indexOf(searchTerm) + searchTerm.length);

      if (!code) {
        console.log("Couldn't find auth code.");
        return false;
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" as RequestCredentials,
        mode: "cors" as RequestMode,
        body: JSON.stringify({
          code,
        }),
      };

      let response = await fetch(`${apiUrl}/login`, requestOptions);
      let data = await response.json();
      return data;
    };

    asyncFetch().then((data) => {
      if (data.id) {
        navigate("/dashboard");
        let { id, username, avatar, discriminator } = data;
        dispatch(actions.userActions.login({ id, username, avatar, discriminator }));
      } else {
        navigate("/")
      }
    });
  }, []);

  return (
    <div className="error">
      <span>{errorMessage}</span>
    </div>
  );
};

export default Login;
