import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // ✅ Check authentication
   const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check", {
                headers: {
                    token: localStorage.getItem("token") // ✅ THIS LINE IMPORTANT
                }
            });

            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    // ✅ Login / Register
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            if (data.success) {
                setAuthUser(data.user);

                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);

                connectSocket(data.user);

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ✅ Logout
    const logout = () => {
        localStorage.removeItem("token");

        setAuthUser(null);
        setOnlineUsers([]);
        setToken(null);

        axios.defaults.headers.common["token"] = null;

        socket?.disconnect();
        setSocket(null);

        toast.success("Logout Successfully");
    };

    // ✅ Update Profile
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);

            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ✅ Socket Connection
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

       const newSocket = io(backendUrl, {
            transports: ["websocket"],
            query: {
                userId: userData._id,
            },
        });
        
        newSocket.on("online-users", (users) => {
            setOnlineUsers(users);
        });

        setSocket(newSocket);

        
    };

    // ✅ Run once when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }

        return () => {
            socket?.disconnect();
        };
    }, [token]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};