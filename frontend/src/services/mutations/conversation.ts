
import { QueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";
import toast from "react-hot-toast";
import { Conversation } from "@/lib/types";



// create new conversation by CSR
export const useCreateConversation = (queryClient: QueryClient) => {
    return useMutation({
        mutationFn: (data: { ticketLink: string, message: string; }) => axiosInstance.post("/conversations/create", data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["csr_conversations", "active"] });
            toast.success("Conversation created successfully");
        },
        onError: (error) => {
            toast.error("Failed to create conversation");
        }
    });
};

// set conversation status
export const useSetConversationStatus = (queryClient: QueryClient) => {
    return useMutation({
        mutationFn: (data: { conversationId: string, status: "pending" | "solved", topic: string; }) => axiosInstance.post("/conversations/update/status", data),
        onSuccess: (data: { data: Conversation; }) => {
            toast.success("Conversation status updated successfully");


            queryClient.invalidateQueries({ queryKey: ["conversation", data.data.id] });
        },
        onError: (error) => {

            toast.error("Failed to update conversation status");
        }
    });
};