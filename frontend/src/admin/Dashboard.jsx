
import logo from '../assets/logo.webp'
import { Link, useNavigate, } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';


function Dashboard() {
const  BACKEND_URL= import.meta.env.VITE_API_URL;

  // set admin profile
const[isProfileOpen,setIsProfileOpen]=useState(false)
const[adminId,setAdminId]=useState(null)
const[adminName,setAdminName]=useState(null)

useEffect(()=>{
  const navigate=useNavigate()
  const admin=localStorage.getItem('admin')
  if(!admin){
   navigate('/admin/login')
  }else{
    navigate('/admin/dashboard')
  }

})

const handleLogout = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
      withCredentials: true
    });
    localStorage.removeItem('admin')
    toast.success(response.data.message);
  } catch (error) {
    console.error("Error in logout", error);
    toast.error(error.response?.data?.errors || "Error in logout");
  }
};

useEffect(()=>{
   const adminData=JSON.parse(localStorage.getItem('admin'))
   if(adminData){
    setAdminId(adminData?.admin?.email)
    setAdminName(adminData?.admin?.firstName)
   }
  })

  const handleProfile=()=>{
    setIsProfileOpen(!isProfileOpen)
  }




  return (
    <div className='h-screen flex'>
      {/* sidebar */}
       <div className=' w-100 sm:w-70 bg-gray-100 mb-10 p-5'>
          <div className='flex flex-col items-center mb-10'>

           {/* toggle prolife */}
            <div className='relative'>
              <button onClick={handleProfile} className='cursor-pointer'>
               <img src={logo} alt="Profile" className='rounded-full w-20 h-20' />
              </button>
              {isProfileOpen && (
               <div className="absolute z-1  -left-2 top-20 w-60 bg-white border border-gray-200 rounded-lg shadow-lg p-3">

                {adminId ? (
                  <div>
                     <p className="font-semibold">Admin Name:<span className="font-normal mb-1">{adminName}</span></p>
                     <p className="font-semibold">Admin ID:<span className="font-normal">{adminId}</span></p>
                  </div>
                ):(
                 <p className="text-sm text-gray-500">Not Logged In</p>
                )}
               </div>
              )}
            </div>
            <h2 className='text-lg font-semibold mt-4'>I'm Admin</h2>
           </div>
           <nav className='flex flex-col space-y-4'>
             <Link to="/admin/our-courses">
             <button className='w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-xl'>Our Courses</button></Link>
             <Link to="/admin/create-course">
             <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl'>Create Course</button></Link>
             <Link to="/">
             <button className='w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl'>Home</button></Link>
             <Link to="/courses">
             <button onClick={handleLogout} className='w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl'>Logout</button></Link>
           </nav>
       </div>
       <div className='font-bold fixed invisible sm:visible text-4xl text-gray-600  h-screen flex items-center justify-center ml-[40%]'>
        Welcome Admin!
       </div>
    </div>
  )
}

export default Dashboard
