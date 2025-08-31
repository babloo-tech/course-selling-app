
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import { RiAdminFill } from "react-icons/ri";
import logo from '../assets/logo.webp'
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Courses() {
  const  BACKEND_URL= import.meta.env.VITE_API_URL;
  const[courses,setCourses]=useState([])  //fetch course store data 1st
  const[search,setSearch]=useState("")  // serch value from form
  const[searchCourse,setSearchCourse]=useState([])  // search courses data

  const[isLoggedIn,setIsLoggedIn]=useState(false)
  const[loading,setLoading]=useState(true)
  const[isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  const[isProfileOpen,setIsProfileOpen]=useState(false) // user profiles
  const[userName,setUserName]=useState(null)
  const[userId,setUserId]=useState(null)
  const navigate=useNavigate()

  console.log("courses data",courses)
  // token
  useEffect(()=>{
    const token= localStorage.getItem("user")
    if(token)
    {
       setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  },[])

// logout
  const handleLogout = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/logout`, {
      withCredentials: true
    });
    localStorage.removeItem('user')
    toast.success(response.data.message);
    setIsLoggedIn(false);
  } catch (error) {
    console.error("Error in logout", error);
    toast.error(error.response?.data?.error || "Error in logout");
  }
};

  // when component loads, check user info
  useEffect(() => {
  const userData =JSON.parse(localStorage.getItem('user')) // convert to object
  if (userData) {
    setUserId(userData?.user?.email); 
    setUserName(userData?.user?.firstName) 
  } 
}, []);

// toggle function(event) for profile
const toggleProfile = () => {
  setIsProfileOpen(!isProfileOpen);
};
// fetch courses
  useEffect(()=>{
        const fetchCourses= async()=>{
        try{
          const response=await axios.get(`${BACKEND_URL}/course/courses`, 
            { withCredentials:true})
          setCourses(response.data.courses)  // 1st time render all course
          setSearchCourse(response.data.courses) 
          setLoading(false)
        }catch(error){
         console.log("error in fecthCourse",error)
       }
  }
    fetchCourses()
  },[])

  
  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  // search course by name
  const handleSearch= async(e)=>{
    e.preventDefault()
    if(!search.trim()){
      setSearchCourse(courses)
    }
    else if(search.trim().length>=3){
      const result= await courses.filter(course=>
        course.title.trim().toLowerCase().includes(search.toLowerCase())
      )
      setSearchCourse(result)
    }
  }

  return (
  <div className="flex">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0  left-0 h-screen bg-gray-100 w-75 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4  hover:text-blue-500">
              <Link to={"/"} className="flex items-center">
                <RiHome2Fill className="mr-2 " /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to={"#"} className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4  hover:text-blue-500 ">
              <Link to={"/purchases"} className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4  hover:text-blue-500">
              <Link to={"#"} className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li className="mb-4">
              {isLoggedIn ? (
                <Link to={"/"}
                  
                  className="flex items-center  hover:text-blue-500"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center hover:text-blue-500">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
             <Link className="mb-4 hover:text-blue-500">
              <Link to={"/admin/login"} className="flex items-center">
                <RiAdminFill className="mr-2" /> Admin
              </Link>
            </Link>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-30 w-full bg-white p-6">
        <header className="flex justify-between items-center mb-10">
          <h1  className="text-xl hidden sm:block  font-bold">All Courses</h1>
          <div className="flex items-center space-x-3 ms-8 sm:ms-0">
            <div className="flex items-center">
              <input
                type="text"
                onChange={(e)=>setSearch(e.target.value)}
                onKeyUp={handleSearch}
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <FaCircleUser className="text-4xl text-blue-600 hover:text-blue-800 cursor-pointer" 
              onClick={toggleProfile}/>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute z-1  right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
              >
                {userId ? (
                  <div className="text-gray-700 text-sm  ">
                    <p className="font-semibold  mb-1">User Name: <span className="font-normal">{userName}</span></p> 
                    <p className="font-semibold">User ID: <span className="font-normal">{userId}</span></p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Not Logged In</p>
                )}
              </div>
            )}
          </div>
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-x-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            // Check if courses array is empty
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p> 
          ) : (   // check if courses array is available
            <div style={{minWidth:'200px'}} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-5  gap-6" >
              {searchCourse?.map((course) => (
                <div 
                  key={course._id} // card part
                  className="border border-gray-300 hover:border-gray-400 rounded-lg p-6 bg-white shadow-sm
             transition-transform duration-400 ease-in-out  will-change-transform
             hover:scale-105 hover:shadow-lg "
                >
                  <img 
                    src={course.image.url}
                    alt={course.title}
                    className="h-50 object-cover w-full rounded-t-lg"
                    
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-800  text-md mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ₹{course.price}{" "}
                      <span className="text-green-500 line-through">499</span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>

                  {/* Buy page */}
                  <button
                    onClick={()=>(navigate(`/buy/${course._id}`))} // Pass courseId in URL
                    className="bg-orange-500 w-full text-white px-4 py-2  rounded-lg hover:bg-blue-900 duration-300
                    cursor-pointer "
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Courses
