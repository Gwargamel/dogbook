import axios from 'axios'; // Axios används för att utföra HTTP-förfrågningar till det specificerade API:et

// Bas-URL för API:et (lokalservern på port 5000)
const API_BASE_URL = 'http://localhost:5000'; 

// Varje funktion är asynkron och använder async/await för att hantera asynkrona operationer. Fel som uppstår i förfrågningsprocessen loggas och kastas vidare så att de kan hanteras av den som implementerar dessa funktioner.

// Funktion för att hämta alla hundar från servern
export const fetchDogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dogs`);
    return response.data; // Returnerar data som mottas från servern
  } catch (error) {
    console.error("Failed to fetch dogs", error); 
    throw error; 
  }
};

// Funktion för att skapa en ny hund på servern
export const createDog = async (dogData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/dogs`, dogData);
    return response.data;
  } catch (error) {
    console.error("Failed to create dog", error);
    throw error;
  }
};

// Funktion för att uppdatera en befintlig hund
export const updateDog = async (id, dogData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/dogs/${id}`, dogData);
    return response.data;
  } catch (error) {
    console.error("Failed to update dog", error);
    throw error;
  }
};

// Funktion för att radera en befintlig hund
export const deleteDog = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/dogs/${id}`);
    // Eftersom ingen data behöver returneras vid radering finns det ingen return-sats här
  } catch (error) {
    console.error("Failed to delete dog", error);
    throw error;
  }
};

// Funktion för att hämta information om en specifik hund baserat på ID
export const fetchDogById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch dog with id ${id}`, error);
    throw error;
  }
};

// Hämta information om flera hundar baserat på en lista av ID:n
export const fetchDogsByIds = async (ids) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/dogs/batch`, { ids });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dogs by ids", error);
    throw error;
  }
};
