import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, fetchAllMessages } from "../../../apiCalls/message";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnread } from "../../../apiCalls/chat.js";
import { setSelectedChat } from "../../../redux/userSlice.js";
import EmojiPicker from 'emoji-picker-react';




const Chat = ({ socket }) => {

    const { selectedChat, user: currentUser, allChats } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const selectedUser = selectedChat?.members.find((u) => u._id !== currentUser._id);
    const [messageText, setMessageText] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [currentInputImage, setCurrentInputImage] = useState('');

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

        if (diff < 1) {
            return `Today ${moment(timeStamp).format('hh:mm A')}`;
        }
        else if (diff < 2) {
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
            text: messageText,
            image : currentInputImage,
        }

        try {

            // emit a message using socket
            const socketMessageData = {
                ...message,
                members: selectedChat.members.map(m => m._id),
                read: false,
                createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
            }

            socket.emit('send-message', socketMessageData)

            const response = await createNewMessage(message);
            if (response.success) {
                setMessageText('');
            }
            else {
                toast.error(response.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }

        // set the image property empty again
        setCurrentInputImage('');
    }


    // fetch all messages 
    useEffect(() => {
        // get all messages
        const getAllMessages = async () => {
            try {
                const response = await fetchAllMessages(selectedChat._id);
                if (response.success) {
                    setAllMessages(response.data);
                }
                else {
                    toast.error(response.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }

        // fetch
        getAllMessages();
    }, [selectedChat]);


    // fetch all messages of a chat on receiving a new message
    useEffect(() => {
        // get all messages
        const getAllMessages = async () => {
            try {
                const response = await fetchAllMessages(selectedChat._id);
                if (response.success) {
                    setAllMessages(response.data);
                }
                else {
                    toast.error(response.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }


        // handle the incoming message
        const handleReceivedMessage = (message) => {
            getAllMessages();
            // find selected chat
            if (selectedChat) {
                const newSelectedChat = allChats.find((ch) => ch._id === selectedChat._id);
                dispatch(setSelectedChat(newSelectedChat));
            }
        }

        socket.on("receive-message", handleReceivedMessage);

        return () => {
            socket.off('receive-message');
        }
    }, [selectedChat, dispatch, socket, allChats]);



    // handle is typing indicator
    useEffect(() => {
        const handleTyping = (data) => {
            if (selectedChat._id === data?.currentChatId && data?.sender !== currentUser._id) {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                }, 2000);
            }
        };

        const handleStopTyping = (data) => {
            if (selectedChat._id === data?.currentChatId && data?.sender !== currentUser._id) {
                setIsTyping(false);
            }
        };

        socket.on('user-typing-status', handleTyping);
        socket.on('user-stopped-typing-status', handleStopTyping);

        return () => {
            socket.off('user-typing-status', handleTyping);
            socket.off('user-stopped-typing-status', handleStopTyping);
            setIsTyping(false);
        };
    }, [socket, selectedChat, currentUser]);


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


    // automatically scroll down on incoming message
    useEffect(() => {
        const msgContainer = document.getElementById('msg-container');
        msgContainer.scrollTo({
            top: msgContainer.scrollHeight,
            behavior: 'smooth'
        });

    }, [allMessages, selectedChat]);


    // listen to new selected chat 
    useEffect( () => {

        // get all messages
        const getAllMessages = async () => {
            try {
                const response = await fetchAllMessages(selectedChat._id);
                if (response.success) {
                    setAllMessages(response.data);
                }
                else {
                    toast.error(response.message);
                }
            }
            catch (error) {
                toast.error(error.message);
            }
        }

        const handleNewSelectedChatEvent = (chat) => {
            const members = chat.members.map(m => m._id);
            if(members.includes(currentUser._id)) {
                getAllMessages();
            }
        }

        socket.on('new-selected-chat-status', handleNewSelectedChatEvent);

        return () => {
            socket.off('new-selected-chat-status');
        }
    }, [socket, currentUser]);



    // send message on pressing enter 
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && messageText.trim()) {
            sendMessage();
        }
    };


    // handle input image
    const handleInputImage = (e) => {
        const file = e.target.files[0];

        // if no file found
        if(!file) return;

        const reader = new FileReader();

        reader.onloadend = async () => {
            setCurrentInputImage(reader.result);
            toast.success("image selected");
        }

        reader.readAsDataURL(file);


    }



    return (
        <>

            {
                selectedChat &&
                (
                    <div className="app-chat-area"  >
                        <div className="app-chat-area-header">
                            
                            {/* receiver data  */}
                            {selectedUser && <div> {getFullName(selectedUser)} </div>}

                            {/* is typing indicator */}
                            {isTyping && <div className="typing-indicator">Typing....</div>}
                        </div>
                        <div className="main-chat-area" id="msg-container" >
                            {/* chat area  */}
                            {
                                allMessages.map((msg, ind) => {
                                    const isSender = msg.sender === currentUser._id;

                                    return (
                                        <div
                                            className="message-container"
                                            key={ind}
                                            style={{ justifyContent: isSender ? "end" : "start" }}
                                        >
                                            <div>
                                                {/* show message text  */}
                                                {
                                                    msg.text && 
                                                    <div
                                                        className={isSender ? "send-message" : "received-message"}
                                                    >
                                                        {msg.text}
                                                    </div>
                                                }

                                                {/* show message image  */}
                                                
                                                {
                                                    msg?.image && 
                                                    <div
                                                        className={isSender ? "send-message" : "received-message"}
                                                    >
                                                        <img 
                                                            src={msg.image} 
                                                            alt="image" 
                                                            height="120px" 
                                                            width="150px"> 
                                                        </img>
                                                    </div>
                                                }
                                                



                                                



                                                <div
                                                    className={"message-timestamp"}
                                                    style={{ float: isSender ? "right" : "left" }}
                                                >
                                                    {/* time info */}
                                                    {formatTime(msg.createdAt)}

                                                    {/* chat seen info */}
                                                    {
                                                        (isSender && msg.read) && <span className="seen-msg"><i className="fa-solid fa-check-double"></i> </span>
                                                        || (isSender && <span className="unseen-msg"><i className="fa-solid fa-check-double"></i></span>)
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>


                        {/* emoji picker  */}
                        {
                            showEmojiPicker && 
                            
                                <EmojiPicker className="emoji-picker-style" onEmojiClick={(e) => {
                                    setMessageText(messageText + e.emoji);
                                }}/>
                           

                        }


                        <div className="send-message-div">

                            {/* send message */}
                            <input
                                type="text"
                                className="send-message-input"
                                placeholder="Type a message"
                                // for typing indicator
                                onChange={e => {
                                    setMessageText(e.target.value);
                                    socket.emit("user-typing", {
                                        currentChatId: selectedChat?._id,
                                        members: selectedChat?.members?.map(m => m._id),
                                        sender: currentUser._id
                                    });
                                }}
                                value={messageText}
                                onKeyDown={
                                    (e) => {
                                        handleKeyDown(e);
                                        socket.emit('user-stopped-typing', {
                                            currentChatId: selectedChat?._id,
                                            members: selectedChat?.members?.map(m => m._id),
                                            sender: currentUser._id
                                        });
                                    }
                                }
                            />

                                
                            {/* controls the file picker  */}
                            <label className="fa-solid fa-image  send-image-button"  htmlFor="file-picker">
                            </label>

                            {/* input for file picker  */}
                            <input  
                                type="file"  
                                style={{display : "none"}}  
                                id="file-picker"  
                                accept="image/jpg, image/png, image/jpeg, image/gif" 
                                onChange={handleInputImage}
                            />



                            {/* controls emoji picker area  */}
                            <button className="fa-solid fa-face-smile emoji-button" onClick={() => setShowEmojiPicker(prev => !prev) }> 
                            </button>

                            {/* sends message  */}
                            <button
                                className="fa fa-paper-plane send-message-btn"
                                aria-hidden="true"
                                onClick={
                                    () => {
                                        sendMessage();
                                        socket.emit('user-stopped-typing', {
                                            currentChatId: selectedChat?._id,
                                            members: selectedChat?.members?.map(m => m._id),
                                            sender: currentUser._id
                                        });
                                    }
                                }
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
