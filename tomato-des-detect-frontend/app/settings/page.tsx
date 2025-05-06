
  "use client";
  import  { useState } from 'react'
  import { Button, Input, Card, Spin, Image, message } from "antd";
  import {
    LogoutOutlined,  
    LoadingOutlined 
  } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../DashboardLoyout/page';

  export default function Settings() {
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const[oldPassword,setOldPassword]=useState('');
      const[newPassword,setNewPassword]=useState('');
      const [confirmPassword,setConfirmPassword]=useState('');
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
const router = useRouter();      
        const handleLogout = () => {
          setIsLogoutLoading(true);
          localStorage.clear();
          router.push("/");
          message.success('Logged out successfully');
        };

    return (
      <DashboardLayout activePage='settings'>
      <div className="space-x-6  flex gap-3 flex-col md:flex-row justify-center items-center">
        <Card className='flex justify-center items-center '>
          <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-2 rounded-md' >
          <label className='text-xl font-semibold'>Profile Information</label>
          <h2 type="secondary" className='text-md'>Update your account profile information and settings</h2>
          
          
          <div className="flex flex-col md:flex-row gap-6  items-start">
            
            <div className="flex flex-col items-center gap-2 border border-gray-200 shadow-md p-4 rounded-md">
            <Image  src={"/passport.jpg"} placeholder={" https://via.placeholder.com/40"} 
              alt="profile" className="my-1 rounded-full border border-gray-200 shadow-md p-2"   width={150} height={150} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className='mb-2'>FirstName</label>
                <Input id="name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className='mb-2'>LastName</label>
                <Input id="name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div>
                <label className='mb-2'> User Email</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
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
            >
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
            <Button type="primary"           >
              Update Password</Button>
          </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-center items-center mt-8">
        <Card className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-10 rounded-md'>
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

