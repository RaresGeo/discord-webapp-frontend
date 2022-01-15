import React from "react";
import { Link } from "react-router-dom";

import actions from "../actions/";
import { useAppSelector, useAppDispatch } from "../hooks";

import "../index.css";

const Navbar: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const apiUrl = "http://localhost:3001";
  const encodeEnpoint = () => {
    // Might want to encode this later so I made it into a function, but for now it just returns a string
    return "https://discord.com/api/oauth2/authorize?client_id=684391080925462609&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds";
  };

  let endpoint = encodeEnpoint();

  const onLogout = async () => {
    let response = await fetch(`${apiUrl}/logout`, { method: "POST", credentials: "include" as RequestCredentials });
    let data = await response.json();
    console.log("Logged out,", data);

    dispatch(actions.userActions.logout());
  };

  const navigationStyles = "flex items-center h-full px-1 sm:px-3 lg:px-5 hover:bg-gray-500 text-gray-300 font-semibold text-lg";

  const username = (
    <Link className={navigationStyles} to="/">
      <span>{`${user.username}#${user.discriminator}`} </span>
      <img className="h-full rounded-full p-1 ml-1 sm:ml-2 lg:ml-3" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`} alt="avatar" />
    </Link>
  ); // I need to make some sort of user profile component here
  const login = (
    <a className={navigationStyles} href={endpoint}>
      Login
    </a>
  );
  const logout = (
    <Link className={navigationStyles} to="/" onClick={onLogout}>
      <span>Logout</span>
    </Link>
  );

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className={navigationStyles} to="/dashboard">
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center justify-center h-full">
            {user.loggedIn ? username : login}
            {user.loggedIn && logout}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
