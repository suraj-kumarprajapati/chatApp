import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, fetchAllMessages } from "../../../apiCalls/message";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnread } from "../../../apiCalls/chat.js";


const Chat = () => {

    const { selectedChat, user: currentUser, allChats} = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const selectedUser = selectedChat?.members.find((u) => u._id !== currentUser._id);
    const [messageText, setMessageText] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [lastSentMessage, setLastSentMessage] = useState({});

    // returns the full name of the user
    const getFullName = (u) => {
        const { firstName, lastName } = u;
        const fullName = firstName + " " + lastName;
        return fullName.toUpperCase();
    }

    // format the time
    const formatTime = (timeStamp) => {
        const now = moment();
        const diff = now.diff(moment(timeStamp), 'days');

        if(diff < 1) {
            return `Today ${moment(timeStamp).format('hh:mm A')}`;
        }
        else if(diff < 2) {
            return `Yesterday ${moment(timeStamp).format('hh:mm A')}`;
        }
        else {
            return `${moment(timeStamp).format('MMM, D hh:mm A')}`;
        }
    }


    // send a new message
    const sendMessage = async () => {
        const message = {
            chatId: selectedChat._id,
            sender: currentUser._id,
            text: messageText
        }

        try {
            const response = await createNewMessage(message);
            if (response.success) {
                setLastSentMessage({...response.data});
                setMessageText('');
            }
            else {
                toast.error(response.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }


    // fetch all messages of a chat
    useEffect(() => {
        const getAllMessages = async () => {
            try {
                const response = await fetchAllMessages(selectedChat._id);
                if (response.success) {
                    setAllMessages(response.data);
                    // toast.success(response.message)
                }
                else {
                    toast.error(response.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }

        getAllMessages();
    }, [lastSentMessage, selectedChat, dispatch]);


    // clear unread messges
    useEffect(() => {
        const clearUnreadMsg = async () => {
            try {
                const response = await clearUnread(selectedChat._id);
                if (response.success) {
                    const updatedChat = response.data;
                    // update allChats with updated selected chat
                    allChats.map((chat) => {
                        return chat._id === selectedChat._id ? updatedChat : chat;
                    });
                    // toast.success(response.message)
                }
                else {
                    toast.error(response.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }

        
        clearUnreadMsg();
    }, [selectedChat, dispatch, allChats]);


    





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
                            {
                                allMessages.map((msg, ind) => {
                                    const isSender = msg.sender === currentUser._id;

                                    return (
                                        <div 
                                            className="message-container"  
                                            key={ind} 
                                            style={{justifyContent : isSender ? "end" : "start"}}
                                        >
                                            <div>
                                                <div 
                                                    className={isSender ? "send-message" : "received-message"} 
                                                >
                                                    {msg.text}
                                                </div>

                                                

                                                <div 
                                                    className={"message-timestamp"}
                                                    style={{float : isSender ? "right" : "left"}}
                                                >
                                                    {formatTime(msg.createdAt)}
                                                    {
                                                        (isSender && msg.read) && <span style={{color : "green", opacity : "100%", fontWeight : "bolder"}}><i className="fa-solid fa-check-double"></i> </span> 
                                                        || (isSender && <span><i className="fa-solid fa-check-double"></i></span>)
                                                    }
                                                    {
                                                        
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

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
