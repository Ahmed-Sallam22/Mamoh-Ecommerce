import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';
import { HOST_API2 } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });
const axiosInstance2 = axios.create({ baseURL: HOST_API2 });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance.get(url, { ...config });
    return res.data;
  } catch (error) {
    // Check if the error is due to undefined URL
    if (error.response && error.response.status === 404 && error.response.config.url.includes('undefined')) {
      throw new Error('Invalid URL: ' + error.response.config.url);
    } else {
      // Handle other errors
      throw error; // Rethrow the error to propagate it further if needed
    }
  }
};
export const fetcher2 = async (args) => {
  try {
    const [url, accessToken, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance2.get(url, { ...config, headers: { Authorization: `Bearer ${accessToken}` } });
    return res.data;
  } catch (error) {
    // Check if the error is due to undefined URL
    if (error.response && error.response.status === 404 && error.response.config.url.includes('undefined')) {
      throw new Error('Invalid URL: ' + error.response.config.url);
    } else {
      // Handle other errors
      throw error; // Rethrow the error to propagate it further if needed
    }
  }
};

// ----------------------------------------------------------------------

export const sender = async (args) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.post(url, { ...config });
    
    return res.data;
};

// ----------------------------------------------------------------------


export const endpoints = {
  chat: '/api/chat/chats',  
  message: '/api/chat/chat-messages',

  kanban: '/api/kanban',
  currencies:'/api/currencies',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/users/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  delivery: {
    allOrders: '/api/order/',
    details: '/api/order/',
    update: '/api/order/update',

  },
  post: {
    create: 'api/contact-us/create',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/owner/my-products',
    delete: '/api/products/delete',
    details: '/api/products/',
    create: '/api/products/create',
    search: '/api/product/search',
    update: '/api/products/update',
  },
  user:{
    update:"/api/users/update-data",
    resete_password:"/api/users/change-password"
  },
  Business: {
    list: '/api/owner/my-businesses',
    create:'/api/business/create',
    delete: '/api/business/delete',
    details: '/api/business/',
    search: '/api/business/search',
    update: '/api/business/update',
    categories:'/api/business-categories'
  },
  Fillter:{
    color:'/api/filters/departments'
  }


};
