import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { useAppSelector, useAppDispatch } from "./hooks";
import actions from "./actions/";
import Leaderboard from "./components/Leaderboard";
import Config from "./components/Config";
import Balance from "./components/Balance";

const App: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const apiUrl = "http://localhost:3001";

  useEffect(() => {
    const asyncFetch = async () => {
      const requestOptions = {
        method: "POST",
        credentials: "include" as RequestCredentials,
        mode: "cors" as RequestMode,
      };

      let response = await fetch(`${apiUrl}/login`, requestOptions);
      let data = await response.json();
      return data;
    };

    if (!user.loggedIn && user.loggingIn)
      asyncFetch().then((data) => {
        console.log("Attempted login");
        if (data.id) {
          let { id, username, avatar, discriminator } = data;
          dispatch(actions.userActions.login({ id, username, avatar, discriminator }));
        } else dispatch(actions.userActions.failedLogin());
      });
  }, []);
  return (
    <Router>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="leaderboard" element={<Leaderboard apiUrl={apiUrl} />} />
          <Route path="config" element={<Config apiUrl={apiUrl} />} />
          <Route path="balance" element={<Balance apiUrl={apiUrl} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
