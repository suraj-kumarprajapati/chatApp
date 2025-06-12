

import { axiosInstance } from "."; 


// send message
export const createNewMessage =  async (message) => {
    try {
        const response = await axiosInstance.post("api/messages/newMessage", message);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}