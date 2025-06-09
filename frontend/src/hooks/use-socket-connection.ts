'use client';
import { cleanupSocketEvents, setupSocketEvents } from "@/services/socketEventService";
import { authenticateSocket, createSocketConnection, disconnectSocket, requestCurrentUserStatus, setUserStatus, startHeartbeat } from "@/services/socketService";
import { useSocketStore } from "@/stores/useSocketStore";
import { useUserStore } from "@/stores/useUserStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";




export const useSocketConnection = () => {
    const queryClient = useQueryClient();
    const { user } = useUserStore();
    const { socket, isConnected, setSocket, setIsConnected } = useSocketStore();
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);


    // use ref to track user for cleanup
    const prevUserRef = useRef<typeof user>(null);

    useEffect(() => {
        if (user && !socket) {
            const toastId = toast.loading("Connecting to server...");

            // create socket connection
            const newSocket = createSocketConnection(user);
            setSocket(newSocket);


            // setup events handlers
            setupSocketEvents(newSocket, queryClient);


            // connection events
            newSocket.on("connect", () => {
                authenticateSocket(newSocket, user);
            });

            newSocket.on("authenticated", () => {
                setIsConnected(true);
                toast.success("Connected", { id: toastId });
                requestCurrentUserStatus(newSocket);

                // Start heatbeat for TTL refresh
                if (user.role === "team_lead") {
                    heartbeatRef.current = startHeartbeat(newSocket);
                }

                // set status online for CSRs
                if (user.role === "csr") {
                    setUserStatus(newSocket, "online");
                }
            });

            newSocket.on("unauthorized", () => {
                setIsConnected(false);
                setSocket(null);
                toast.error("Authentication failed", { id: toastId });
            });

            newSocket.on("disconnect", () => {
                setIsConnected(false);
                if (user) {
                    toast.loading("Reconnecting...", { id: toastId });
                } else {
                    toast.error("Disconnected", { id: toastId });
                }
            });


            prevUserRef.current = user;


        } else if (!user && socket) {
            // Clean up when user logs out - use previous user data
            const prevUser = prevUserRef.current;
            if (prevUser?.role === "csr") {
                setUserStatus(socket, "offline");
            }
            cleanupSocketEvents(socket);
            disconnectSocket(socket);
            setSocket(null);
            setIsConnected(false);
            toast.dismiss();
            prevUserRef.current = null;
        }


        // update ref when user changes
        if (user) {
            prevUserRef.current = user;
        }


        return () => {
            if (socket) {
                cleanupSocketEvents(socket);
            }

            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
            }



        };
    }, [user, socket, queryClient, setSocket, setIsConnected]);

    return { socket, isConnected };

};