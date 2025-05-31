'use client';

import { useQueryClient } from "@tanstack/react-query";
export function useReadCache<T>(keys: string[]) {
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<T>(keys);
    return data;
}








