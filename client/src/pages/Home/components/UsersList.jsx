import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { toast } from 'react-hot-toast';
import { showLoader, hideLoader } from '../../../redux/loaderSlice.js';
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import moment from "moment";





const UsersList = ({ searchKey }) => {

    // get all user details from state
    const { allUsers, allChats, user: currentUser, selectedChat } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();



    // open the chat to selected user
    const openChat = (selectedUserId) => {
        const chat = allChats.find((currentChat) => currentChat.members.map(m => m._id).includes(currentUser._id) && currentChat.members.map(m => m._id).includes(selectedUserId));

        if (chat) {
            dispatch(setSelectedChat(chat));
        }
    }

    // does selectedChat contains this user
    const selectedChatContainsUser = (user) => {
        if (selectedChat) {
            return selectedChat.members.map((u) => u._id).includes(user._id);
        }
        return false;
    }


    // method to start a new chat
    const startNewChat = async (searchedUserId) => {
        try {
            dispatch(showLoader());
            const response = await createNewChat([currentUser._id, searchedUserId]);
            if (response.success) {
                toast.success(response.message);
                const newChat = response.data;
                const updatedChats = [...allChats, newChat];
                dispatch(setAllChats(updatedChats));

                // find the updated chat and select it or open it
                dispatch(setSelectedChat(newChat));
            }
            else {
                toast.error(response.message);
            }
            dispatch(hideLoader());
        }
        catch (error) {
            toast.error(error.message);
            dispatch(hideLoader());
        }
    }


    // get last message
    const getLastMessage = (userid) => {
        const chat = allChats.find((c) => c.members.map((m) => m._id).includes(userid));

        if (!chat || !chat.lastMessage || !chat.lastMessage.text)
            return "";

        const prefix = (chat?.lastMessage?.sender === currentUser._id) ? "You : " : "";
        return prefix + chat?.lastMessage?.text.substring(0, 25) + "...";
    }

    // get last message timestamp
    const getLastMsgTimeStamp = (userid) => {
        const chat = allChats.find((c) => c.members.map((m) => m._id).includes(userid));

        if (!chat || !chat.lastMessage || !chat.lastMessage.createdAt)
            return "";

        return moment(chat.lastMessage.createdAt).format("hh:mm A");
    }


    // get unread message count
    const getUnreadMsgCount = (userid) => {
        const chat = allChats.find((c) => c.members.map(m => m._id).includes(userid));
        if (!chat || !chat?.unreadMessageCount)
            return 0;

        if (chat?.lastMessage?.sender == currentUser?._id) {
            return 0;
        }

        return chat.unreadMessageCount
            ;
    }


    const getUsers = () => {
        return allUsers.filter((user) => {
            const fullName = user.firstName + " " + user.lastName;
            return (
                // if search key is present
                searchKey && fullName.toLowerCase().includes(searchKey.toLowerCase())
            ) || (
                    // show the users who has already started chat with current user
                    allChats.some((chat) => chat.members.map(m => m._id).includes(user._id))
                );
        })
    }


    return (
        <>

            {
                getUsers()
                .map((user, index) => { 
                return (
                    <div className="user-search-filter" key={index} onClick={() => openChat(user._id)} >
                        <div className={selectedChatContainsUser(user) ? "selected-user" : "filtered-user"}>
                            <div className="filter-user-display">
                                {/* if profile pic is available */}
                                {
                                    user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"></img>
                                }

                                {/* if profile pic is not available  */}
                                {
                                    !user.profilePic &&
                                    <div className={selectedChatContainsUser(user) ? "user-selected-avatar" : "user-default-avatar"}>
                                        {user.firstName.toUpperCase().charAt(0) + user.lastName.toUpperCase().charAt(0)}
                                    </div>
                                }

                                {/* user details  */}
                                <div className="filter-user-details">
                                    <div className="user-display-name">
                                        {user.firstName.toUpperCase() + " " + user.lastName.toUpperCase()}
                                    </div>
                                    <div className="user-display-email">
                                        {getLastMessage(user._id) || user.email}
                                    </div>
                                </div>

                                {/* unread count and time stamp of last message  */}
                                <div className="chat-meta-data">
                                    <div className={getUnreadMsgCount(user._id) == 0 ? "unread-msg-cnt-zero" : "unread-msg-cnt"}>
                                        <p>{getUnreadMsgCount(user._id) + " "}</p>
                                    </div>
                                    <div className="last-message-timestamp">
                                        {getLastMsgTimeStamp(user._id)}
                                    </div>
                                </div>

                                {
                                    // don't show start chat button for the users who already started the chat with current user
                                    !allChats.find((chat) => chat.members.map(m => m._id).includes(user._id)) &&
                                    <div className="user-start-chat">
                                        <button
                                            className="user-start-chat-btn"
                                            onClick={() => startNewChat(user._id)}
                                        >
                                            Start Chat
                                        </button>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                )
            })
            }

        </>
    )
}


export default UsersList;