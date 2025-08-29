import  { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'
import { Link ,useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../utils/utils'

function Signup() {

  const[firstName,setFirstName]=useState("")
  const[lastName,setLastName]=useState("")
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("")
  const[errorMessage,setErrorMessage]=useState("")
  
  const navigate=useNavigate()

  const handleSumbit=async(e)=>{
     e.preventDefault()
  try{
     const response= await axios.post(`${BACKEND_URL}/user/signup`,
      {firstName,lastName,email,password},
      {withCredentials:true,
       headers:{"Content-Type":"application/json"},
      })

      console.log("singup successfull",response.data)
      toast.success(response.data.message)
      navigate("/login")
      
  }catch (error) {
   if(error.response){
     toast.error(error.response?.data.errors || error.response?.data.message )
   }else{
       setErrorMessage("something went wrong")
   }
      
    }
  }

  return (
    <div className='bg-gradient-to-r from-black  to-blue-950'>
     <div className='h-screen flex  text-white items-center justify-center container mx-auto p-10 '>
         {/* Header */}
        <header className='flex justify-between items-center w-full absolute top-0 p-5'>
         <div className='flex items-center space-x-2'>
          <img src={logo} alt="" className='h=10 w-10 rounded-full' />
          <h1 className='text-2xl font-bold text-orange-500'>CourseHub</h1>
         </div>
         <div className='space-x-4'> 
          <Link to={"/login"} className='bg-transparent hover:bg-blue-800 py-2 px-4 border border-white text-white rounded'>Login</Link>
          <Link to={"/courses"} className='bg-orange-500 hover:bg-blue-800 py-2 px-4 border border-white text-white rounded'>Join now</Link>
         </div>
      </header>
         {/* singup form */}
         <div className='bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] mt-20'>
           <h2 className='text-2xl font-bold mb-4 text-center'>
             Welcome to <span className='text-orange-500'>CourseHub</span> 
           </h2>
           <p className='text-center text-gray-400 mb-4 text-lg'>Just singup to Join Us!</p>
           <form onSubmit={handleSumbit}>
            <div>
              <label htmlFor="firstname" className='text-gray-400 mb-2'>First Name</label>
              <input 
              type="text"
              value={firstName}
              onChange={(e)=>setFirstName(e.target.value)}
              id="firstname"
              placeholder='Enter first name'
              className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-blue-500  mb-4' 
               />
            </div>
            <div>
                 <label htmlFor="lastname" className='text-gray-400 mb-2'>Last Name</label>
              <input 
              type="text"
              value={lastName}
               onChange={(e)=>setLastName(e.target.value)}
              id="lastname"
              placeholder='Enter last name'
              className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-blue-500 required mb-4' 
               />
            </div>
            <div>
                 <label htmlFor="email" className='text-gray-400 mb-2'>Email</label>
              <input 
              type="email"
              value={email}
               onChange={(e)=>setEmail(e.target.value)}
              id="email"
              placeholder='name@gmail.com'
              required
              className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-blue-500 required mb-4'
               />
            </div>
            <div>
                 <label htmlFor="password" className='text-gray-400 mb-2 '>Password</label>
              <input 
              type="password"
              value={password}
               onChange={(e)=>setPassword(e.target.value)}
              id="password"
              placeholder='********'
              required
              className='w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-blue-500 required mb-4'
               />
            </div>
             {errorMessage && (
               <div className='mb-4 text-red-500 text-center'>{errorMessage}</div>)}
            <button type='submit' className=' text-white font-bold w-full bg-amber-500 hover:bg-blue-500 py-3 rounded-lg text-lg transition cursor-pointer'>
               Signup
            </button>
           </form>
         </div>
      </div>
    </div>
  )
}

export default Signup
