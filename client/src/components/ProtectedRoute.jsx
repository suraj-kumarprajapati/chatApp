

import React, {useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, getAllUsers } from '../apiCalls/users';
import Loader from "./Loader";
import { setAllChats, setAllUsers, setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import {toast} from 'react-hot-toast';
import { getAllChats } from '../apiCalls/chat';

export const ProtectedRoute = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    
    const dispatch = useDispatch();

    // get current user details
    useEffect(() => {
        const getUserDetails = async () => {
            

            try {
                const response = await getCurrentUser();
                if(response.success) {
                    const currentUser = response.data;
                    dispatch(setUser(currentUser));
                    setIsLoggedIn(true);
                }
                else {
                    toast.error(response.message);
                    dispatch(setUser(null));
                    setIsLoggedIn(false);
                }
            }
            catch(error) {
                toast.error(error.message);
                dispatch(setUser(null));
                setIsLoggedIn(false);
            }
        }

        
        getUserDetails();
    }, [dispatch]);


    // get all users
    useEffect(() => {
        const getAllUserDetails = async () => {
            

            try {
                const response = await getAllUsers();
                if(response.success) {
                    const allUsers = response.data;
                    dispatch(setAllUsers(allUsers));
                    setIsLoggedIn(true);
                }
                else {
                    toast.error(response.message);
                    dispatch(setAllUsers([]));
                    setIsLoggedIn(false);
                }
            }
            catch(error) {
                toast.error(error.message);
                dispatch(setAllUsers([]));
                setIsLoggedIn(false);
            }
        }

        
        getAllUserDetails();
    }, [dispatch]);



    // get all chats
    useEffect(() => {
        const getAllChatsDetails = async () => {
            

            try {
                const response = await getAllChats();
                if(response.success) {
                    const allChats = response.data;
                    dispatch(setAllChats(allChats));
                    setIsLoggedIn(true);
                }
                else {
                    toast.error(response.message);
                    dispatch(setAllChats([]));
                    setIsLoggedIn(false);
                }
            }
            catch(error) {
                toast.error(error.message);
                dispatch(setAllChats([]));
                setIsLoggedIn(false);
            }
        }

        
        getAllChatsDetails();
    }, [dispatch]);


    if(isLoggedIn == null) {
        return <Loader />
    }
    else if(isLoggedIn) {
        return children;
    }
    else {
        return <Navigate to = "/login" replace />
    }
}
