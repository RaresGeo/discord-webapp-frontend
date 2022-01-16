import React from "react";
import { NavLink } from "react-router-dom";

import actions from "../actions/";
import { useAppSelector, useAppDispatch } from "../hooks";

import "../index.css";

interface IProps {
  apiUrl: string;
}

const Navbar: React.FC<IProps> = ({ apiUrl }) => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

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

  const navStyles = "flex items-center h-full px-1 sm:px-3 lg:px-5 hover:bg-gray-500 text-gray-300 font-semibold text-lg";

  const getNavStyles = (isActive: boolean) => {
    return [isActive ? "bg-gray-500" : undefined, navStyles].join(" ");
  };

  const username = (
    <NavLink className={({ isActive }) => getNavStyles(isActive)} to="/">
      {`${user.username}#${user.discriminator}`}
      <img className="h-full rounded-full p-1 ml-1 sm:ml-2 lg:ml-3" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`} alt="avatar" />
    </NavLink>
  ); // I need to make some sort of user profile component here
  const login = (
    <a className={navStyles} href={endpoint}>
      Login
    </a>
  );
  const logout = (
    <NavLink className={navStyles} to="/" onClick={onLogout}>
      Logout
    </NavLink>
  );

  return (
    <nav className="bg-gray-800 z-50">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink className={({ isActive }) => getNavStyles(isActive)} to="/dashboard">
            Dashboard
          </NavLink>

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
