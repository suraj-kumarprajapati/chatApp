

import React, {useEffect, useState} from 'react';
import { checkLoginStatus } from '../apiCalls/auth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect( () => {

        const getLoginStatus = async () => {
            const status = await checkLoginStatus();
            setIsLoggedIn(status);
        }

        getLoginStatus();
    }, []);


    if(isLoggedIn == null) {
        return <div>Loading...</div>
    }
    else if(isLoggedIn) {
        return children;
    }
    else {
        return <Navigate to = "/login" replace />
    }
}
