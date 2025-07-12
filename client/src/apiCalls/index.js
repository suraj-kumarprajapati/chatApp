

import axios from 'axios';

export const url = 'https://chatapp-server-taqu.onrender.com';

export const axiosInstance = axios.create({
    withCredentials : true,
});