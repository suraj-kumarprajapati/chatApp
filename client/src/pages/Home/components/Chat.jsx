import { useDispatch, useSelector } from "react-redux";
import { createNewMessage } from "../../../apiCalls/message";
import { toast } from "react-hot-toast";
import { showLoader, hideLoader } from "../../../redux/loaderSlice.js"
import { useState } from "react";


const Chat = () => {

    const { selectedChat, user: currentUser } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const selectedUser = selectedChat?.members.find((u) => u._id !== currentUser._id);
    const [messageText, setMessageText] = useState('');

    // returns the full name of the user
    const getFullName = (u) => {
        const { firstName, lastName } = u;
        const fullName = firstName + " " + lastName;
        return fullName.toUpperCase();
    }


    // send a new message
    const sendMessage = async () => {
        const message = {
            chatId: selectedChat._id,
            sender: currentUser._id,
            text: messageText
        }

        dispatch(showLoader());
        try {
            const response = await createNewMessage(message);
            if (response.success) {
                // const respData = response.data;
                toast.success(response.message)
                setMessageText('');
            }
            else {
                toast.error(response.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
        dispatch(hideLoader());
    }



    return (
        <>

            {
                selectedChat &&
                (
                    <div className="app-chat-area">
                        <div className="app-chat-area-header">
                            {/* receiver data  */}
                            {selectedUser && getFullName(selectedUser)}
                        </div>
                        <div className="main-chat-area">
                            {/* chat area  */}
                            CHAT AREA
                        </div>
                        <div className="send-message-div">
                            {/* send message */}
                            <input 
                                type="text" 
                                className="send-message-input" 
                                placeholder="Type a message" 
                                onChange={e => setMessageText(e.target.value)}
                                value={messageText}
                            />
                            <button 
                                className="fa fa-paper-plane send-message-btn" 
                                aria-hidden="true"
                                onClick={sendMessage}
                            >
                            </button>
                        </div>
                    </div>
                )
            }

        </>
    )
}

export default Chat;
