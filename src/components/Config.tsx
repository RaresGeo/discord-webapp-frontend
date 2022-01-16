import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { IGuild } from "../interfaces";

interface IProps {
  apiUrl: string;
}

const Config: React.FC<IProps> = ({ apiUrl }) => {
  const selectedGuild = useOutletContext<IGuild | null>();
  const guildId = selectedGuild?.id;
  const socketUrl = apiUrl.replace("http", "ws");

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  useEffect(() => {
    const message = {
      type: "getConfig",
      payload: {
        guild_id: guildId,
      },
    };

    if (guildId) sendJsonMessage(message);
  }, [guildId]);

  useEffect(() => {
    if (lastJsonMessage?.type === "getConfig") {
      // Update state here with guild data
      console.log("Received new Config: ", lastJsonMessage);
    }
  }, [lastJsonMessage]);

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center mx-auto h-full">
        <div className="flex items-center p-4 h-16 bg-red-500">Config</div>
      </div>
    </div>
  );
};

export default Config;
