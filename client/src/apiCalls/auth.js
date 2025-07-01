

import { axiosInstance } from ".";

export const signupUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/auth/signup", user);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}


export const loginUser = async (user) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", user);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}

export const checkLoginStatus = async () => {
    try {
        const response = await axiosInstance.post("/api/auth/loginStatus");
        const data = response.data;

        if(data.success) {
            return true;
        }
        else {
            return false;
        }
    }
    catch(error) {
        return false;
    }
}

export const logout = async () => {
    try {
        const response = await axiosInstance.post("/api/auth/logout");
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }
}