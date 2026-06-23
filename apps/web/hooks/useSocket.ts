import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI0YjBkMy1kZDg5LTQ3ZDQtOTBiNC0yMTkyZDkwNGRmMjMiLCJ1c2VybmFtZSI6Inlhc2giLCJpYXQiOjE3ODIwMjY0NTl9.9CWFzo6627gBnaDshD7APEN6J4IoQ5Y6Pk8s4hiNjgk`,
    );

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
      setLoading(false);
    };

    ws.onerror = () => {
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    socket,
    loading,
  };
}
