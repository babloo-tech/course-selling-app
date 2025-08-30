import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.webp";

function CourseCreate(){
  const  BACKEND_URL= import.meta.env.VITE_API_URL;
  const[title,setTitle]=useState("")
  const[description,setDescription]=useState("")
  const[price,setPrice]=useState("")
  const[image,setImage]=useState("") // null is best here
  const[imagePreview,setImagePriview]=useState("")
  const navigate=useNavigate()

  //read photo set photo
  const changePhotoHandler=(e)=>{
    const file=e.target.files[0]
    const reader=new FileReader() // pre-define class of js
    reader.readAsDataURL(file)   // convert base64 encoded string(DataURL)
    reader.onload=()=>{
      setImagePriview(reader.result)
      setImage(file)
    }
  }

  // send data to server
  const handleCreateCourse= async(e)=>{
   e.preventDefault()
   const formData=new FormData() // class of js
   formData.append("title",title)
   formData.append("description",description)
   formData.append("price",price)
   formData.append("image",image)

   const admin=JSON.parse(localStorage.getItem('admin'))
    const token=admin.token
    if(!token){
      toast.error("Please login to create the courses")
      navigate('/admin/login')
      return
    }else{
      try{
         const response= await axios.post(`${BACKEND_URL}/course/create`,formData,{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials:true
        })
         console.log(response.data)
         toast.success(response.data.message || "Course Created successfully")
         navigate("/admin/our-courses")
         // all field empty after create
         setTitle("")
         setDescription("")
         setPrice("")
         setImage("")
         setImagePriview("")
      }catch(error){
        console.log(error)
        toast.error(error.response.data.errors || "something went wrong to create course" )
      }
    }
  }

  return (
    <div className='min-h-screen py-4'>
      <div className='max-w-2xl mx-auto p-6 border rounded-lg bg-gray-100/40 shadow-2xl'>
        <Link to={'/admin/dashboard'} className='text-2xl hover:text-blue-500 text-center block font-bold mb-2'> <img src={logo} alt="" className="h-10 mr-2 inline w-10 rounded-full" />Create Course</Link>
        <form onSubmit={handleCreateCourse} className='space-y-2'>
           <div className='space-y-2'> 
            <label className='block font-bold text-lg'>Title</label>
            <input 
            type="text"
            placeholder='enter your course title'
            value={title} 
            onChange={(e)=>setTitle(e.target.value)}
            className='w-full px-3 py-2 border  border-gray-500 rounded-md outline-none '/>
           </div>
          
           <div className='space-y-2'>
            <label className='block font-bold text-md'>Description</label>
            <input 
            type="text"
            placeholder='enter your course description'
            value={description} 
            onChange={(e)=>setDescription(e.target.value)}
            className='w-full px-3 py-2 border border-gray-500 rounded-md outline-none '/>
           </div>
          
           <div className='space-y-2'>
            <label className='block font-bold text-lg'>Price</label>
            <input 
            type="text"
            placeholder='enter your course price'
            value={price} 
            onChange={(e)=>setPrice(e.target.value)}
            className='w-full px-3 py-2 border border-gray-500 rounded-md outline-none '/>
           </div>
           <div className='space-y-2'>
            <label className='block font-bold text-lg'>Course image</label>
            <div className='flex justify-center items-center'>
               <img 
               src={imagePreview ? `${imagePreview}`: "/imgPL.webp"}
               alt="image" 
               className='w-80 max-w-sm h-40 rounded-md object-cover'/>
            </div>
            <input 
            type="file"
            accept='.jpeg,.jpg,.png'
            onChange={changePhotoHandler}
            className='w-full mb-3 px-3 py-2 border border-gray-400 rounded-md outline-none cursor-pointer '/>
           </div>
           <button type='sumbit'
           className=' w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer'>
           Create Course
           </button>
          
        </form>
      </div>

    </div>
  )
}

export default CourseCreate
