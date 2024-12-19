
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5432'; 

const setAuthHeader = () => {
  const token = localStorage.getItem('jwtToken'); 
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const fetchAllTeachers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teachers`, {
      headers: setAuthHeader(),
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error; 
  }
};

export const fetchTeacherById = async (id:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teachers/${id}`, {
      headers: setAuthHeader(),
    });
    return response.data; 
  } catch (error) {
    console.error(`Error fetching teacher by ID ${id}:`, error);
    throw error;
  }
};
