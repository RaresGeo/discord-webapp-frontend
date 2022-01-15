import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface Guild {
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: string;
}

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const [guilds, setGuilds] = useState<Guild[] | null>(null);
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  const apiUrl = "http://localhost:3001";

  useEffect(() => {
    if (!user.loggedIn && !user.loggingIn) goToHome();
    else {
      const asyncFetch = async () => {
        const requestOptions = {
          method: "GET",
          credentials: "include" as RequestCredentials,
          mode: "cors" as RequestMode,
        };

        let response = await fetch(`${apiUrl}/guilds`, requestOptions);
        let data = await response.json();
        return data;
      };

      if (!guilds)
        asyncFetch().then((data) => {
          if (data.length) {
            let newGuilds = data.map((guild: any) => {
              return {
                icon: guild.icon,
                id: guild.id,
                name: guild.name,
                owner: guild.owner,
                permissions: guild.permissions,
              };
            });
            setGuilds(newGuilds);
          }
        });
    }
  }, [user.loggedIn, user.loggedIn, goToHome]);

  const socketUrl = apiUrl.replace("http", "ws");

  //const [formData, setFormData] = useState({date: new Date(), time: '', eventName: ''})

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  useEffect(() => {
    // console.log(lastJsonMessage);
  }, [lastJsonMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const testSend = () => {
    let test = {
      type: "test",
      msg: "Hello, World!",
    };

    sendJsonMessage(JSON.stringify(test));
    console.log(lastJsonMessage);
    console.log(guilds);
  };

  return (
    <div className="Dashboard">
      <div className="flex center items-center justify-center">
        <button className="p-6 m-6 rounded-xl text-gray-300 font-bold text-lg bg-slate-600" onClick={testSend}>
          Test websocket
        </button>
      </div>

      <div className="flex flex-wrap center items-center justify-center">
        {guilds ? (
          guilds.map((guild, index) => {
            return (
              <div key={index} className="bg-slate-600 rounded-xl p-3 w-32 h-50 m-4 flex flex-col items-center justify-between">
                <img className="w-full rounded-xl mb-2" src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`} alt="icon" />
                <span className="text-gray-300 text-xs sm:text-sm lg:text-base font-semibold text-center">{guild.name}</span>
              </div>
            );
          })
        ) : (
          <div style={{ borderTopColor: "transparent" }} className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"></div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 bg-slate-800 rounded-tr-xl opacity-75 hover:opacity-100 text-white text-center text-sm font-semibold px-6 py-3 text-lg flex flex-col items-center">
        No. guilds
        <br />
        {guilds ? guilds.length : "N/A"}
      </div>
      <div className="absolute bottom-0 right-0 bg-slate-800 rounded-tl-xl opacity-75 hover:opacity-100 text-white text-center text-sm font-semibold px-6 py-3 text-lg flex flex-col items-center">
        Websocket connection:
        <br />
        {connectionStatus}
      </div>
    </div>
  );
};

export default Dashboard;
