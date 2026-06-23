"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const { socket, loading } = useSocket();
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (!socket || loading) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "join-room",
        roomId: id,
      }),
    );

    const handleMessage = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "chat") {
        setChats((c) => [...c, { message: parsedData.message }]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((m, idx) => (
        <div key={idx}>{m.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      ></input>

      <button
        onClick={() => {
          const message = currentMessage.trim();
          if (!message || !socket) {
            return;
          }

          socket.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message,
            }),
          );

          setCurrentMessage("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
