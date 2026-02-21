import AxiosInstance from "./axiosInstance";
import { User } from "../store/userStore";

export const updateProfile = async (data: Partial<User>) => {
    const response = await AxiosInstance.patch<User>("/users/me", data);
    return response.data;
};
