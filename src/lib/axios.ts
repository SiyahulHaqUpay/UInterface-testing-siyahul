import axios from 'axios';
import { config } from './config';

const WHITE_LABEL_TOKEN = config.WHITE_LABEL_TOKEN;
const NON_WHITE_LABEL_TOKEN = config.NON_WHITE_LABEL_TOKEN;

const API_URL = config.API_URL;

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const isWhiteLabel = sessionStorage.getItem('isWhiteLabel') === 'true';
        const TOKEN = isWhiteLabel ? WHITE_LABEL_TOKEN : NON_WHITE_LABEL_TOKEN;
        config.headers['Authorization'] = `Bearer ${TOKEN}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);