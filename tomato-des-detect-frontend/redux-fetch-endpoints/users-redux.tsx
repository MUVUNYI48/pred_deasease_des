import axios from "axios";

const GET_ALL_USERS = 'http://localhost:8000/api/admin/users/';
// const DELETE_USER = 'http://localhost:8000/api/admin/users/{id}/delete/';
// Update this in your constants file
// const DELETE_USER = 'http://localhost:8000/api/admin/users/{id}/delete/';
const UPDATE_USER = 'http://localhost:8000/api/admin/users/{id}/update/';
const GET_PRED_USER = 'http://localhost:8000/api/predictions/user/{id}/';

export const get_all_users = async () => {
    try {
        const response = await axios.get(GET_ALL_USERS, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error for Getting all Users:", error);
        throw error;
    }
}

export const update_user = async (userId, userData) => {
    try {
        const response = await axios.put(UPDATE_USER.replace('{id}', userId.toString()), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error for Updating User:", error);
        throw error;
    }
};

export const getPredictionsForUser = async (userId) => {
    try {
        // Make sure userId is properly formatted and URL is correctly built
        const url = GET_PRED_USER.replace('{id}', encodeURIComponent(userId.toString()));
        console.log("Fetching predictions from URL:", url); // Debug log
        
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    }
    catch (error) {
        // More detailed error logging
        console.error(`Error for Getting Predictions for User ${userId}:`, error);
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        // Return empty array instead of throwing to make the UI more resilient
        return [];
    }
}

export const delete_user = async (userId) => {
    try {
      // Use the correct API endpoint format as shown in Postman
      console.log("Deleting user with ID:", userId); // Debug log
      const response = await axios.delete(`http://localhost:8000/api/admin/users/${userId}/delete/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      return response.data;
    }
    catch (error) {
      console.error("Error for Deleting User:", error);
      throw error;
    }
  }

 