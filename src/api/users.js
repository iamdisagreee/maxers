import axios from 'axios';
import { DEFAULT_API_URL } from '../env';
// import {getApiClient} from './client';
// import {Storage} from '../utils/storage'

/**
 * Получение конкретного пользователя по ID
 * @param {number|string} id
 * @param {string} token
 * @returns {Promise<object>}
 */
export const getUser = async (id, token) => {
  const response = await axios.get(`${DEFAULT_API_URL}/api/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Обновление данных пользователя (например, города)
 * @param {number|string} id
 * @param {object} data
 * @param {string} token
 * @returns {Promise<object>}
 */
export const updateUser = async (id, data, token) => {
  const response = await axios.patch(`${DEFAULT_API_URL}/api/v1/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Получение списка всех пользователей
 * @param {string} token
 * @returns {Promise<object[]>}
 */
export const getAllUsers = async (token) => {
  const response = await axios.get(`${DEFAULT_API_URL}/api/v1/users/list`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Получение детального пользователя по ID (для фронта с activity)
 * @param {number|string} id
 * @param {string} token
 * @returns {Promise<object>}
 */
export const getUserDetailed = async (id, token) => {
  const response = await axios.get(`${DEFAULT_API_URL}/api/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Удаление пользователя
 * @param {number|string} id
 * @param {string} token
 * @returns {Promise<object>}
 */
export const deleteUser = async (id, token) => {
  const response = await axios.delete(`${DEFAULT_API_URL}/api/v1/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};



/**
 * Создание пользователя
 * @param {object} userData - { username, firstName, lastName, city, url, role }
 * @returns {Promise<object>} - { detail, accessToken, userId }
 */
export const createUser = async (userData) => {
  const payload = {
    userId: userData.userId || 0,
    username: userData.username || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    role: userData.role || '',
    city: userData.city || '',
    url: userData.url || '',
  };

  try {
    const response = await axios.post(`${DEFAULT_API_URL}/api/v1/users/`, payload, {
      headers: { 'Content-Type': 'application/json' } // auth не нужен
    });

    return response.data; // { detail, accessToken, userId }
  } catch (err) {
    console.error('Failed to create user:', err.response?.data || err.message);
    throw err;
  }
};