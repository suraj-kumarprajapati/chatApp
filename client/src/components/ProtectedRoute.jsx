

import React, {useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../apiCalls/users';
import Loader from "./Loader";
import { setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

export const ProtectedRoute = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    // const [user, setUser] = useState(null);
    const dispatch = useDispatch();


    useEffect(() => {
        const getUserDetails = async () => {
            const response = await getCurrentUser();

            try {
                if(response.success) {
                    const currentUser = response.data;
                    dispatch(setUser(currentUser));
                    setIsLoggedIn(true);
                }
                else {
                    dispatch(setUser(null));
                    setIsLoggedIn(false);
                }
            }
            catch(error) {
                dispatch(setUser(null));
                setIsLoggedIn(false);
            }
        }

        
        getUserDetails();
    }, []);



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
