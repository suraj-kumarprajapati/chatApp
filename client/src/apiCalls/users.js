

import { url, axiosInstance } from "."; 



// get other users
export const getAllUsers =  async () => {
    try {
        const response = await axiosInstance.get(url + "api/users/otherUsers");
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}

// get current logged in user details
export const getCurrentUser =  async () => {
    try {
        const response = await axiosInstance.get(url + "api/users/userDetails");
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}


// upload profile pic
export const uploadProfilePic =  async (image) => {
    try {
        const response = await axiosInstance.post(url + "api/users/upload-profile", {image});
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}