import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data.data);

export default fetcher;