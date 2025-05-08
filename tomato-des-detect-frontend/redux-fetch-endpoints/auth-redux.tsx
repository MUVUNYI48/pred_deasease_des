import axios from 'axios';
const BASE_URL_REGISTER = 'http://localhost:8000/api/register/';
const BASE_URL_LOGIN = 'http://localhost:8000/api/login/';



export const registerUser = async (registerData) => {
  console.log("Register Data:", registerData);
  const formData = new FormData();
  formData.append('fullname', registerData.fullname);
  formData.append('username', registerData.username);
  formData.append('email', registerData.email);
  formData.append('district', registerData.district);
  formData.append('phone_number', registerData.phone_number);
  formData.append('image_profile', registerData.image_profile);
  formData.append('password', registerData.password);
  formData.append('confirm_password', registerData.confirm_password);

  try {
    const response = await axios.post(BASE_URL_REGISTER, formData);
    console.log('User registered successfully:', response.data);

    localStorage.setItem('image_profile', response.data.user.image_profile); // <-- Add this line
    console.log('Image Profile:', response.data.user.image_profile); // Optional debug log
// Optional debug log
  
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    // throw error;
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
    localStorage.setItem('username', response.data.user.username);
    localStorage.setItem('email', response.data.user.email);
    localStorage.setItem('phone', response.data.user.phone);
    localStorage.setItem('fullname', response.data.user.fullname);
    localStorage.setItem('userId', response.data.user.id);

    console.log('Fullname:', response.data.user.fullname); 
    console.log('Username:', response.data.user.username);
    console.log('Email:', response.data.user.email);
    console.log('Token:', response.data.access);
    return response.data;

  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

export const updateUserProfile = async (userId,profileData) => {
  try {
    const response = await axios.post(`http://localhost:8000/api/users/${userId}/update/`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export const change_user_password = async (passwordData) => {
  try {
      const response = await axios.post(`http://localhost:8000/api/auth/change-password/`, {
        current_password: passwordData.get('old_password'),
        new_password: passwordData.get('new_password'),
        confirm_password: passwordData.get('confirm_password')
      }, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
          },
      });
      return response.data;
  }
  catch (error) {
      console.error("Error for Changing User Password:", error);
      throw error;
  }
}
