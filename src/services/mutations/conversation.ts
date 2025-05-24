
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";
import toast from "react-hot-toast";



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