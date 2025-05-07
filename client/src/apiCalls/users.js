

import { axiosInstance } from "."; 



// get other users
export const getOtherUsers =  async () => {
    try {
        const response = await axiosInstance.post("api/users/otherUsers");
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}

// get current logged in user details
export const getCurrentUser =  async () => {
    try {
        const response = await axiosInstance.post("api/users/userDetails");
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}