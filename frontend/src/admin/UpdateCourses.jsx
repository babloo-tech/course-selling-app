import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from "../assets/logo.webp";

function UpdateCourses() {
  const  BACKEND_URL= import.meta.env.VITE_API_URL;
  const {id}=useParams()
  const navigate=useNavigate()
  const[title,setTitle]=useState("")
  const[description,setDescription]=useState("")
  const[price,setPrice]=useState("")
  const[image,setImage]=useState("") // null is best here
  const[imagePreview,setImagePriview]=useState("")
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
   const fetchCourseData= async()=>{
    try{
     const {data}=await axios.get(`${BACKEND_URL}/course/${id}`,{
      withCredentials:true
     })
     console.log(data)
     setTitle(data.title)
     setDescription(data.description)
     setPrice(data.price)
     setImagePriview(data.image.url)
     setLoading(false)
    }catch(error){
       console.log(error)
       toast.error("Failed to fetch course data")
       setLoading(false)
    }
   }
   fetchCourseData()
  },[])
  
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
  const handleUpdateCourse= async(e)=>{
   e.preventDefault()
   const formData=new FormData() // class of js
   formData.append("title",title)
   formData.append("description",description)
   formData.append("price",price)
  if(image){ formData.append("image",image)}

   const admin=JSON.parse(localStorage.getItem('admin'))
    const token=admin.token
    if(!token){
      toast.error("Please login to create the courses")
      navigate('/admin/login')
      return
    }
     {
      try{
         const response= await axios.put(`${BACKEND_URL}/course/update/${id}`,formData,{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials:true
        })
         console.log(response.data)
         toast.success(response.data.message )
         navigate("/admin/our-courses")
         // all field empty after create
         setTitle("")
         setDescription("")
         setPrice("")
         setImage("")
         setImagePriview("")
      }catch(error){
        console.log(error)
        toast.error(error.response.data.errors || "something went wrong to update course" )
      }
    }
  }

    if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
      <div className='min-h-screen sm:py-4'>
      <div className='max-w-3xl mx-auto p-8 border rounded-lg bg-gray-100/40 shadow-2xl'>
        <Link to={'/amin/dashboard'} title='back to dashboard' className='text-2xl block hover:text-blue-500 text-center font-bold mb-2'><img src={logo} alt="" className="h-10 mr-2 inline w-10 rounded-full" />Update Course</Link>
        <form onSubmit={handleUpdateCourse} className='space-y-2'>
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
            <label className='block font-bold text-lg'>Description</label>
            <input 
            type="text"
            placeholder='enter your course description'
            value={description} 
            onChange={(e)=>setDescription(e.target.value)}
            className='w-full px-3 py-2 border border-gray-500 rounded-md outline-none '/>
           </div>
          
           <div className='space-y-2'>
            <label className='block  font-bold text-lg'>Price</label>
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
               className='w-full max-w-sm max-h-45 rounded-md object-cover'/>
            </div>
            <input 
            type="file"
            accept='.jpeg,.jpg,.png'
            onChange={changePhotoHandler}
            className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none cursor-pointer '/>
           </div>
           <button type='sumbit'
           className=' w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer'>
           Update Course
           </button>
          
        </form>
      </div>

    </div>
  )
}

export default UpdateCourses
