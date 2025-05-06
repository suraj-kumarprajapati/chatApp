

import { axiosInstance } from ".";

export const signupUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/users/signup", user);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}


export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/users/login", user);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}