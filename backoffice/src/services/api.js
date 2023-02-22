import axios from 'axios';
import Cookies from 'js-cookie';

import { API_URL } from '../store/constant';

const headers = {
    'Content-Type': 'application/json',
};

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: headers,
    crossdomain: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access');
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401) {
            const refresh_token = Cookies.get('refresh');
            const payload = { refresh: refresh_token };
            try {
                const { status, data } = await axios.post(API_URL + '/refresh-token/', payload);
                if (status === 200) {
                    Cookies.set('access', data.access);
                    Cookies.set('refresh', data.refresh);
                    originalRequest.headers['Authorization'] = 'JWT ' + data.access;
                    // originalRequest.headers.Authorization = `JWT ${data.access}`;
                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                Cookies.remove('access');
                Cookies.remove('refresh');
                Cookies.remove('userInfo');
            }
        }

        return Promise.reject(error);

    }
);

export default axiosInstance;
