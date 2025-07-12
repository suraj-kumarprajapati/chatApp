

import { url, axiosInstance } from "."; 


// send message
export const createNewMessage =  async (message) => {
    try {
        const response = await axiosInstance.post(url + "/api/messages/newMessage", message);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}

// fetch all messages
export const fetchAllMessages =  async (chatId) => {
    try {
        const response = await axiosInstance.get(url + `/api/messages/allMessages/${chatId}`);
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}