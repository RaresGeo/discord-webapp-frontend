import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { NavLink } from "react-router-dom";
import { IGuild } from "../interfaces";

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const [guilds, setGuilds] = useState<IGuild[] | null>(null);
  const [selectedGuild, setSelectedGuild] = useState<IGuild | null>(null);
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  const apiUrl = "http://localhost:3001";

  useEffect(() => {
    if (!user.loggedIn && !user.loggingIn) goToHome();
  }, [user.loggedIn, user.loggingIn, goToHome]);

  const socketUrl = apiUrl.replace("http", "ws");

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    const message = {
      type: "getGuilds",
      payload: {},
    };

    sendJsonMessage(message);
  }, []);

  useEffect(() => {
    if (lastJsonMessage?.type === "getGuilds") {
      // Update state here with guild data
      console.log("Received new leaderboard: ", lastJsonMessage);
      setGuilds(lastJsonMessage.payload);
    }
  }, [lastJsonMessage]);

  const getNavStyles = (isActive: boolean) => {
    return [isActive ? "bg-gray-500" : undefined, "flex items-center h-full px-1 sm:px-3 lg:px-5 hover:bg-gray-500 text-gray-300 font-semibold text-lg"].join(
      " "
    );
  };
  const isAdmin = true;

  return (
    <div className="Dashboard">
      <div className="absolute overflow-y-auto flex flex-col justify-start items-center bg-gray-800 w-20 sm:w-56 lg:w-64 top-16 bottom-0 pt-2">
        {guilds ? (
          guilds.map((guild, index) => {
            return (
              <div
                onClick={() => {
                  setSelectedGuild(guild);
                }}
                key={index}
                className={`hover:cursor-pointer bg-slate-600 hover:bg-slate-700 rounded-xl p-0 sm:p-2 m-2 sm:m-4 h-50 flex items-center justify-center mb-6 ${
                  selectedGuild === guild && "bg-slate-700"
                }`}
              >
                <img className="w-16 rounded-xl" src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`} alt="icon" />
                <span className="text-gray-300 pl-1 hidden sm:block sm:text-sm lg:text-base w-14 sm:w-32 lg:w-40 font-semibold text-center">{guild.name}</span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col h-full w-full items-center justify-center">
            <div style={{ borderTopColor: "transparent" }} className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 right-0 bg-slate-800 rounded-tl-xl opacity-75 hover:opacity-100 text-white text-center text-sm font-semibold px-6 py-3 text-lg flex flex-col items-center">
        Websocket connection:
        <br />
        {connectionStatus}
      </div>
      <div className="pl-20 sm:pl-56 lg:pl-64">
        <div className="bg-zinc-700 z-50">
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-evenly h-16">
              <NavLink className={({ isActive }) => getNavStyles(isActive)} to="leaderboard">
                Leaderboard
              </NavLink>
              <NavLink className={({ isActive }) => getNavStyles(isActive)} to="balance">
                Balance
              </NavLink>

              {isAdmin && (
                <NavLink className={({ isActive }) => getNavStyles(isActive)} to="config">
                  Config
                </NavLink>
              )}
            </div>
          </div>
        </div>
        <div style={{ maxHeight: "calc(100vh - 64px - 64px)" }} className="overflow-y-auto">
          <Outlet context={selectedGuild} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
