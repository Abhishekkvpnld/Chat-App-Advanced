
import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";


const socketContext = createContext();

const getSocket = () => useContext(socketContext);

const SocketProvider = ({ children }) => {

    const socket = useMemo(
        () => io(server, { withCredentials: true }),
        []);
    console.log("socket",socket);
    return (
        <socketContext.Provider value={socket}>{children}</socketContext.Provider>);
};

export { getSocket, SocketProvider };
