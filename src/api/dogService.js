// src/api/dogService.js
import axios from 'axios';

export const fetchDogById = async (id) => {
  try {
    const response = await axios.get(`/api/dogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dog", error);
    throw error;
  }
};

export const fetchDogsByIds = async (ids) => {
  try {
    const response = await axios.post('/api/dogs/batch', { ids });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dogs", error);
    throw error;
  }
};
