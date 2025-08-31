import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'

function OurCourses() {
  const  BACKEND_URL= import.meta.env.VITE_API_URL;
  const[courses,setCourses]=useState([])
  const[loading,setLoading]=useState(true)
  const navigate=useNavigate()

  const admin=JSON.parse(localStorage.getItem("admin"))
  const token=admin?.token
    if(!token){
      toast.error("Please login to admin")
      navigate('/admin/login')
    }

  // fetch courses
  useEffect(()=>{
        const fetchCourses= async()=>{
        try{
          const response=await axios.get(`${BACKEND_URL}/course/courses`, 
            { withCredentials:true})
          setCourses(response.data.courses)
          setLoading(false)
        }catch(error){
         console.log("error in fecthCourse",error)
       }
  }
    fetchCourses()
  },[BACKEND_URL])
  
  // delete course code
  
  const handleDelete=async (id)=>{ // pass parameter
      try{
         let result=confirm('Are you sure you want to delete?')
        if(result){

            const response=await axios.delete(`${BACKEND_URL}/course/delete/${id}`,
          
      {
        headers:{ Authorization:`Bearer ${token}`
        },
        withCredentials:true
      }
    );
    toast.success(response.data.message || "Course deleted successfully");
    const updatedCourses=courses.filter((course)=>course._id!==id)
    setCourses(updatedCourses);
      }
   } catch(error){
       console.log("error in deleting course",error)
       toast.error(error.response?.data?.errors || "Error in deleting course")
      }
   } 
   
if(loading){
  return <p className='text-gray-500 text-center'>Loading...</p>;
}

  return (
    <div className='bg-gray-100 p-8 space-y-4'>
      <h1 className='text-3xl font-bold text-center mb-8 top-0 fixed w-full z-1 bg-gray-400 p-4 '>Our Courses</h1>
      <Link to="/admin/dashboard" f className="bg-orange-400 block mt-10 w-40  py-3 px-4 rounded-lg text-white z-1 hover:bg-orange-900 fixed transition duration-200">Go to Dashboard
      </Link>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-25 gap-6'>
        {
          courses.map(course=>(
            <div key={course._id} className='bg-white shadow-sm rounded-lg p-6 
            transition-transform duration-400  hover:scale-105 easy-out hover:shadow-lg '>
              {/* Course image */}
              <img 
              src={course?.image?.url} 
              alt={course.title} 
              className='h-50 w-full object-cover rounded-t-lg'
              />
              {/* Course Title */}
              <h2 className='text-xl font-semibold mt-4 text-gray-800'>{course.title}</h2>
              {/* Course Description */}
              <p className='text-gray-800 mt-2 text-lg'>{
                course.description.length>100
                ? `${course.description.slice(0,100)}...`
                :course.description }
              </p>
              {/* Course Price */}
              <div className='flex justify-between mt-4 text-gray-800 font-bold'>
                <div>
                  {" "}
                   &#8377;{course.price}
                   {" "}
                   <span className='line-through text-green-500 '>&#8377;300</span>
                 </div>
                  <div className='text-green-600 text-sm mt-2'>10 % off</div> 
              </div>
              <div className='flex justify-between'> 
              
                <Link to={`/admin/update-course/${course._id}`}
                  className="bg-orange-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">Update
                </Link>

                <button 
                onClick={()=>handleDelete(course._id)} // handleDelete pass argument 
                className='bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600'>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default OurCourses
