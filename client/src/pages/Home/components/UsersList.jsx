import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import {toast} from 'react-hot-toast';
import {showLoader, hideLoader} from '../../../redux/loaderSlice.js';
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";




const UsersList = ({ searchKey }) => {

    // get all user details from state
    const { allUsers, allChats, user : currentUser, selectedChat } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();


    // open the chat to selected user
    const openChat = (selectedUserId) => {
        const chat = allChats.find((currentChat) => currentChat.members.map(m => m._id).includes(currentUser._id) && currentChat.members.map(m => m._id).includes(selectedUserId));

        if(chat) {
            dispatch(setSelectedChat(chat));
        }
    }

    // does selectedChat contains this user
    const selectedChatContainsUser = (user) => {
        if(selectedChat) {
            return selectedChat.members.map((u) => u._id).includes(user._id);
        }
        return false;
    }

    
    // method to start a new chat
    const startNewChat = async (searchedUserId) => {
        try {
            dispatch(showLoader());
            const response = await createNewChat([currentUser._id, searchedUserId]);
            if(response.success) {
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
        catch(error) {
            toast.error(error.message);
            dispatch(hideLoader());
        }
    }


    return (
        <>

            {
                allUsers.filter((user) => {
                    const fullName = user.firstName + " " + user.lastName;
                    return (
                        // if search key is present
                        searchKey && fullName.toLowerCase().includes(searchKey.toLowerCase())
                    ) || (
                        // show the users who has already started chat with current user
                        allChats.some((chat) => chat.members.map(m => m._id).includes(user._id))
                    );
                }).map((user, index) => {
                    return (
                        <div className="user-search-filter" key={index}  onClick={() => openChat(user._id)} >
                            <div className={selectedChatContainsUser(user) ? "selected-user" :  "filtered-user"}>
                                <div className="filter-user-display"> 
                                    {/* if profile pic is available */}
                                    {
                                        user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"></img>
                                    }
                            
                                    {/* if profile pic is not available  */}
                                    {
                                        !user.profilePic && 
                                        <div className={selectedChatContainsUser(user) ?"user-selected-avatar" : "user-default-avatar"}>
                                            {user.firstName.toUpperCase().charAt(0) + user.lastName.toUpperCase().charAt(0)}
                                        </div>
                                    }
                                   
                                    <div className="filter-user-details">
                                        <div className="user-display-name">
                                            {user.firstName.toUpperCase() + " " + user.lastName.toUpperCase()}
                                        </div>
                                        <div className="user-display-email">
                                            {user.email}
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