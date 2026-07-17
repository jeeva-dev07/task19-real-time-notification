import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import API from "../api";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Load existing notifications
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");

        setNotifications(res.data);

        const unread = res.data.filter(
          (n) => Number(n.is_read) === 0
        ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.log("Notification fetch error:", error);
      }
    };

    fetchNotifications();

    // Socket connection
    const s = io("http://127.0.0.1:5000");

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket Connected");

      s.emit("join", {
        user_id: user.id,
        role: user.role,
      });
    });

    s.on("joined", (data) => {
      console.log("Joined:", data);
    });

    // Receive new notification
    s.on("new_notification", (data) => {
      console.log("New Notification:");
      console.log(JSON.stringify(data, null, 2));
      console.log("created_at:", data.created_at);

      setNotifications((prev) => [
        {
          ...data,
          is_read: 0,
        },
        ...prev,
      ]);

      setUnreadCount((count) => count + 1);
    });

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
