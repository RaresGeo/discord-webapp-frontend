import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { NavLink } from "react-router-dom";
import { IGuild } from "../interfaces";

interface IProps {
  apiUrl: string;
}

const Dashboard: React.FC<IProps> = ({ apiUrl }) => {
  const user = useAppSelector((state) => state.user);
  const [guilds, setGuilds] = useState<IGuild[] | null>(null);
  const [selectedGuild, setSelectedGuild] = useState<IGuild | null>(null);
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

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
      console.log("Received new guilds: ", lastJsonMessage);
      setGuilds(lastJsonMessage.payload);

      setTimeout(() => {
        console.log(guilds);
      }, 1000);
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
                  if (guild.has_bot) setSelectedGuild(guild);
                }}
                key={index}
                className={`relative rounded-xl p-0 sm:p-2 m-2 sm:m-4 h-50 flex items-center justify-center mb-6 ${selectedGuild === guild && "bg-slate-700"} ${
                  !guild.has_bot ? "bg-zinc-700/50" : "hover:cursor-pointer bg-slate-500 hover:bg-slate-700"
                }`}
              >
                {!!(!guild.has_bot && guild.is_admin) && (
                  <div className="absolute w-full h-full top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
                    <a
                      href={process.env.REACT_APP_BOT_INVITE + guild.id}
                      className="bg-blue-500 text-white border-solid border-black border-0 hover:border-2 hover:bg-blue-400 p-3 rounded-md"
                    >
                      Invite bot
                    </a>
                  </div>
                )}
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
