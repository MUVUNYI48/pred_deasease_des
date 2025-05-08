
  "use client";
  import  { useEffect, useState } from 'react'
  import { Button, Input, Card, Spin, Image, message } from "antd";
  import {
    LogoutOutlined,  
    LoadingOutlined, 
    SaveOutlined
  } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../DashboardLoyout/page';
import { change_user_password } from '@/redux-fetch-endpoints/auth-redux';

  export default function Settings() {
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const[oldPassword,setOldPassword]=useState('');
      const[newPassword,setNewPassword]=useState('');
      const [confirmPassword,setConfirmPassword]=useState('');
      const [fullname, setFullName] = useState('');
      const [email, setEmail] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [profileImage, setProfileImage] = useState('');
      const [userId, setUserId] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [isLoadingPassword, setIsLoadingPassword] = useState(false);
      const router = useRouter();      
        const handleLogout = () => {
          setIsLogoutLoading(true);
          localStorage.clear();
          router.push("/");
          message.success('Logged out successfully');
        };
// useEffect that will Computer the Profile Image for User Logged In

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user) {
    setEmail(user.email);
  }
  setFullName(localStorage.getItem("fullname") || "");
  setProfileImage(localStorage.getItem("image_profile") || "");
  setPhoneNumber(localStorage.getItem("phone") || "");
  setEmail(localStorage.getItem("email") || "");
  setUserId(localStorage.getItem("userId") || "");
}, []);

// Function to change profile
const handleProfileChange = async () => {
  setIsLoading(true);
  try{
    if(!fullname || !email || !phoneNumber) {
      message.error("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    const response=await updateUserProfile(userId,formData);
    console.log('Profile updated successfully:', response.data);
    alert('Profile updated successfully');
  }catch(error){
    message.error("Profile change Failed",error);
  }
  setIsLoading(false);
}
const handleUpdatePassword = async () => {
  setIsLoadingPassword(true);
  try{
    if(!oldPassword || !newPassword || !confirmPassword) {
      message.error("Please fill in all fields");
      return;
    }
    if(newPassword !== confirmPassword) {
      message.error("New password and confirm password do not match");
      return;
    }
    const formData = new FormData();
    formData.append('old_password', oldPassword);
    formData.append('new_password', newPassword);
    formData.append('confirm_password', confirmPassword);
    const response=await change_user_password(formData);
    console.log('Password updated successfully:', response.data);
    alert('Password updated successfully');
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }catch(error){
    message.error("Password change Failed",error);
  }
  setIsLoadingPassword(false);
}
    return (
      <DashboardLayout activePage='settings'>
      <div className="space-x-6  flex gap-3 flex-col md:flex-row justify-center items-center">
        <Card className='flex justify-center items-center '>
          <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-2 rounded-md' >
          <label className='text-xl font-semibold'>Profile Information</label>
          <h2 type="secondary" className='text-md'>Update your account profile information and settings</h2>
          
          
          <div className="flex flex-col md:flex-row gap-6  items-start">
            
            <div className="flex flex-col items-center gap-2 border border-gray-200 shadow-md p-4 rounded-md">
            <Image  src={`http://localhost:8000${profileImage}`}  placeholder={" https://via.placeholder.com/40"} 
              alt="profile" className="my-1 rounded-full border border-gray-200 shadow-md p-2"   width={150} height={150} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className='mb-2'>Full Name</label>
                <Input id="name" value={fullname} onChange={(e) => setFullName(e.target.value)} />
              </div>
             
              <div>
                <label className='mb-2'> User Email</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div>
                <label className='mb-2'> User Phone Number</label>
                <Input id="phoneNumber" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
              </div>
            </div>

          </div>
          
          
          <div className="flex justify-between">
            <Button 
              onClick={handleLogout} 
              danger 
              disabled={isLogoutLoading}
              icon={isLogoutLoading ? <Spin indicator={<LoadingOutlined />} /> : <LogoutOutlined />}
            >
              Logout
            </Button>
            <Button 
              type="primary" 
              onClick={handleProfileChange}
              disabled={isLoading}
              icon={isLoading ? <Spin indicator={<LoadingOutlined />}  /> : <SaveOutlined />}            >
              Save Changes
            </Button>
          </div>
          </div>
        </Card>

        <Card className='flex justify-center items-center '>
          <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-2 rounded-md'>
          <label className='text-xl font-semibold mb-2'>Security & Privacy</label>
          <h2 type="secondary">Manage your password and security settings</h2>
          
          
          <div className="space-y-4">
            <div>
              <label className='mb-2'>Current Password</label>
              <Input id="current-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            <div>
              <label className='mb-2'>New Password</label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <label>Confirm New Password</label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
          </div>
          
          
          <div>
            <Button type="primary" onClick={handleUpdatePassword}
              disabled={isLoadingPassword}
              icon={isLoadingPassword ? <Spin indicator={<LoadingOutlined />} /> : <SaveOutlined />}
              >
                Update Password</Button>
          </div>
          </div>
        </Card>
      </div>
      <div className="flex w-full mt-8">
        <Card className='w-full max-w-full space-y-6 border border-gray-200 shadow-md p-10 rounded-md'>
          <label className='text-xl font-semibold'>Delete Account</label>
          <h2 type="secondary">Permanently delete your account and all associated data</h2>
          <Button danger type="primary" className='w-full'>
            Delete Account
          </Button>
        </Card>
        </div>
      </DashboardLayout>
    )
  }

