import axios from 'axios';
import { set } from 'react-hook-form';
const BASE_URL_REGISTER = 'http://localhost:8000/api/register/';
const BASE_URL_LOGIN = 'http://localhost:8000/api/login/';


 export const registerUser = async (registerData)=>{
  console.log("Register Data:", registerData);
  try {
    const response = await axios.post(BASE_URL_REGISTER, registerData,{
        headers: {
            'Content-Type': 'application/json',
          },
    });
    console.log('User registered successfully:', response.data);
    return response.data;
  
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }

 }


 export const loginUser = async (loginData)=>{
  console.log("Login Data:", loginData);
  try {
    const response = await axios.post(BASE_URL_LOGIN, loginData, {
      headers: {
        'Content-Type': 'application/json',

      },
    });
    console.log('User logged in successfully:', response.data);
    localStorage.setItem('token', response.data.access);
    console.log('Token:', response.data.access);
    return response.data;

  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}
