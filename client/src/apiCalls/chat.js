

import {url, axiosInstance} from "./";


const getAllChats = async () => {
    try {
        const response = await axiosInstance.get(url + "/api/chats/allChats");
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}

const createNewChat = async (members) => {
    try {
        const response = await axiosInstance.post(url + "/api/chats/newChat", {
            members : members,
        });
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}

const clearUnread = async (chatId) => {
    try {
        const response = await axiosInstance.post(url + "/api/chats/clear-unread-messages", {
            chatId : chatId,
        });
        return response.data;
    }
    catch(error) {
        return error.response.data;
    }
}


export { 
    getAllChats,
    createNewChat,
    clearUnread,
};