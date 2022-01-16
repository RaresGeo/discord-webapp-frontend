import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { IGuild } from "../interfaces";
import { IUser } from "../interfaces";

interface IProps {
  apiUrl: string;
}

const Leaderboard: React.FC<IProps> = ({ apiUrl }) => {
  const selectedGuild = useOutletContext<IGuild | null>();
  const [leaderboardData, setLeaderboardData] = useState<IUser[]>([]);
  const guildId = selectedGuild?.id;
  const socketUrl = apiUrl.replace("http", "ws");

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  useEffect(() => {
    const message = {
      type: "getLeaderboard",
      payload: {
        guild_id: guildId,
      },
    };

    if (guildId) sendJsonMessage(message);
  }, [guildId]);

  useEffect(() => {
    if (lastJsonMessage?.type === "getLeaderboard") {
      // Update state here with guild data
      console.log("Received new leaderboard: ", lastJsonMessage);
      setLeaderboardData(lastJsonMessage.payload);
    }
  }, [lastJsonMessage]);

  return (
    <div className="flex flex-col items-center justify-center mx-auto h-full">
      <div className="overflow-auto p-4">
        {leaderboardData.map(({ tag, balance, avatar }, index) => {
          return (
            <div key={index} className="bg-slate-600 hover:bg-slate-700 rounded-xl p-0 sm:p-2 m-2 sm:m-4 h-50 flex items-center justify-center mb-6">
              <img className="w-16 rounded-xl" src={avatar} alt="icon" />
              <div className="flex flex-col items-center">
                <span className="text-gray-300 pl-1 w-40 font-bold text-center">
                  <span className="text-xl px-1">{index + 1}.</span>
                  {tag}
                </span>
                <div className="w-fit">
                  <span>💵</span>
                  <span className="text-green-500 pl-1 w-40 font-semibold text-center">{balance}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
