"use client";

import { useUserStore } from "@/app/hooks/use-user-store";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketProps {
  socket: Socket<any, any> | null;
  onlineUsers: string[];
}
export const SocketContext = createContext<SocketProps>({
  socket: null,
  onlineUsers: [],
});

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { profile } = useUserStore();

  const fetchSocket = useCallback(() => {
    if (profile?.id) {
      const socket = io("http://localhost:8000", {
        query: {
          userId: profile.id,
        },
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      setSocket(null);
    }
  }, [profile]);

  useEffect(() => {
    fetchSocket();
  }, [fetchSocket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
