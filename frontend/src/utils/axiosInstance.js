import axios from 'axios';

// Create an instance of Axios
const instance = axios.create({
  baseURL: 'https://chatify-9mj0.onrender.com/api',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
