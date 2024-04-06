import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Ersätt med din faktiska API-bas-URL

// Hämta alla hundar
export const fetchDogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dogs`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dogs", error);
    throw error;
  }
};

// Skapa en ny hund
export const createDog = async (dogData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/dogs`, dogData);
    return response.data;
  } catch (error) {
    console.error("Failed to create dog", error);
    throw error;
  }
};

// Uppdatera en hunds information
export const updateDog = async (id, dogData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/dogs/${id}`, dogData);
    return response.data;
  } catch (error) {
    console.error("Failed to update dog", error);
    throw error;
  }
};

// Ta bort en hund
export const deleteDog = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/dogs/${id}`);
  } catch (error) {
    console.error("Failed to delete dog", error);
    throw error;
  }
};

// Hämta information för en specifik hund baserat på ID
export const fetchDogById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch dog with id ${id}`, error);
    throw error;
  }
};

// Hämta information för flera hundar baserat på en lista av ID:n
export const fetchDogsByIds = async (ids) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/dogs/batch`, { ids });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dogs by ids", error);
    throw error;
  }
};
