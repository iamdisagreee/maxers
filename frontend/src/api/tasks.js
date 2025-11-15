import axios from 'axios';
import { DEFAULT_API_URL } from '../env';

/**
 * Добавление новой задачи
 * @param {object} taskData
 * @param {string} token
 * @returns {Promise<{detail: string}>}
 */
export const addTask = async (taskData, token) => {
  const response = await axios.post(`${DEFAULT_API_URL}/api/v1/tasks/`, taskData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Получение всех задач
 * @param {string} token
 * @param {number} page
 * @param {string} typeList - 'user' или 'pending'
 * @returns {Promise<object[]>}
 */
export const getAllTasks = async (token, page = 1, typeList = 'user') => {
  const response = await axios.get(`${DEFAULT_API_URL}/api/v1/tasks/list/${page}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { type_list: typeList }
  });
  return response.data;
};

/**
 * Получение конкретной задачи
 * @param {string} taskId
 * @param {string} token
 * @returns {Promise<object>}
 */
export const getTask = async (taskId, token) => {
  const response = await axios.get(`${DEFAULT_API_URL}/api/v1/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Обновление задачи
 * @param {string} taskId
 * @param {object} taskData
 * @param {string} token
 * @returns {Promise<{detail: string}>}
 */
export const updateTask = async (taskId, taskData, token) => {
  const response = await axios.patch(`${DEFAULT_API_URL}/api/v1/tasks/${taskId}`, taskData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Создание отчёта по задаче
 * @param {string} taskId
 * @param {object} reportData
 * @param {string} token
 * @returns {Promise<{detail: string}>}
 */
export const createTaskReport = async (taskId, reportData, token) => {
  const response = await axios.post(`${DEFAULT_API_URL}/api/v1/tasks/${taskId}/reports`, reportData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
