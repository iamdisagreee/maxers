// src/api/client.js
import axios from 'axios';
import { Storage } from '../utils/storage';
import { DEFAULT_API_URL } from '../env';

let apiClient = null;

function createClient(baseURL) {
  const client = axios.create({
    baseURL: baseURL || DEFAULT_API_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use(async (config) => {
    try {
      const token = await Storage.getToken();
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.warn('Failed to get token from storage', err);
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error('API Error:', err.response?.data || err.message);
      return Promise.reject(err);
    }
  );

  return client;
}

export async function getApiClient() {
  if (!apiClient) {
    const baseURL = await Storage.getApiUrl();
    apiClient = createClient(baseURL || DEFAULT_API_URL);
    console.log('getApiClient: created client with baseURL=', apiClient.defaults.baseURL);
  }
  return apiClient;
}

// сбросить клиент (если сменили URL в Storage)
export function resetApiClient() {
  apiClient = null;
}