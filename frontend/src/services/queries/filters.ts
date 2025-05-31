import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";


export function useLoadAgentsFilter() {
    return useQuery<string[]>({
        queryKey: ["agents"],
        queryFn: () => axiosInstance.get("/filters/agents").then(res => res.data)
    });
}

export function useLoadTeamleadersFilter() {
    return useQuery<string[]>({
        queryKey: ["teamleaders"],
        queryFn: () => axiosInstance.get("/filters/teamleaders").then((res) => res.data),
    });
}