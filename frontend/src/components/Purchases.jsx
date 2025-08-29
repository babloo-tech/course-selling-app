import { useState,useEffect } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { IoMdSettings } from "react-icons/io";
import { FaDiscourse, FaDownload } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import logo from '../assets/logo.webp'
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";

function Purchases() {
  const  BACKEND_URL= import.meta.env.VITE_API_URL;
  const[purchases,setPurchase]=useState([])
  const[isLoggedIn,setIsLoggedIn]=useState(false)
  const[errorMessage,setErrorMessage]=useState(true)
   const[loading,setLoading]=useState(true) // processig situation
  const[isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  console.log("purchases",purchases) 

  // token
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    const token=user?.token
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

// fetch courses
  useEffect(()=>{
   const user=JSON.parse(localStorage.getItem('user'))
   const token=user?.token
   const fetchPurchases= async ()=>{
   if(!token){
    setErrorMessage('Please login to purchase the courses')
    return;
   }
   try{
    const response=await axios.get(`${BACKEND_URL}/user/purchases`,{
      headers:{
        Authorization:`Bearer ${token}`
      },
       withCredentials:true
    })
     setPurchase(response.data.courseData)
     setLoading(false)
   }catch(error){
    setErrorMessage(error?.response?.data?.errors || "Failed to fetch purchase data")
   }
    
  }    
  fetchPurchases()
  },[])

  
  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
   
    <div className="flex h-screen">
          {/* Hamburger menu button for mobile */}
          <button
            className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
          </button>
    
          {/* Sidebar */}
          <aside
            className={`fixed top-0  left-0 h-screen bg-gray-100 w-70 p-5 transform z-10 transition-transform duration-300 ease-in-out  ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:static`}
          >
            <div className="flex items-center mb-10 mt-10 md:mt-0">
              <img src={logo} alt="Profile" className="rounded-full h-12 w-12" />
            </div>
            <nav>
              <ul>
                <li className="mb-4  hover:text-blue-500">
                  <a href="/" className="flex items-center">
                    <RiHome2Fill className="mr-2 " /> Home
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/courses" className="flex items-center text-blue-500">
                    <FaDiscourse className="mr-2" /> Courses
                  </a>
                </li>
                <li className="mb-4  hover:text-blue-500 ">
                  <a href="/purchases" className="flex items-center">
                    <FaDownload className="mr-2" /> Purchases
                  </a>
                </li>
                <li className="mb-4  hover:text-blue-500">
                  <a href="#" className="flex items-center">
                    <IoMdSettings className="mr-2" /> Settings
                  </a>
                </li>
                <li>
                  {isLoggedIn ? (
                    <Link to={"/"}
                      
                      className="flex items-center  hover:text-blue-500"
                      onClick={handleLogout}
                    >
                      <IoLogOut className="mr-2" /> Logout
                    </Link>
                  ) : (
                    <Link to={"/login"} className="flex items-center">
                      <IoLogIn className="mr-2" /> Login
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </aside>
    
          {/* Main content */}
          <main className="ml-0  w-full bg-white p-10">
            <header className="flex  flex-col fixed top-0 my-4 ms-10 justify-between items-center mb-10">
              <h1 className="text-xl font-extrabold">My Purchased Courses</h1>
            </header>
    
            {/* Vertically Scrollable Courses Section */}
            <div className=" mt-4 overflow-x-auto h-[75vh]">
              {loading ? (
                <p className="text-center text-xl text-red-500">{errorMessage}</p>
              ) : purchases.length === 0 ? (
                // Check if courses array is empty
                <p className="text-center text-xl text-gray-500">
                   You have no purchase yet 
                </p> 
              ) : (   // check if courses array is available
                <div className="grid sm:grid-cols-2  md:grid-cols-3 gap-6">
                  {purchases.map((course) => (
                    <div
                      key={course._id}
                      className="border   border-gray-300 rounded-lg p-15 shadow-sm"
                    >
                      <img 
                        src={course.image.url}
                        alt={course.title}
                        className="rounded mb-5"
                      />
                      <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                      <p className="text-gray-600 mb-4">
                        {course.description.length > 100
                          ? `${course.description.slice(0, 100)}...`
                          : course.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-xl">
                          ₹{course.price}{" "}
                          <span className="text-green-500 line-through">5999</span>
                        </span>
                        <span className="text-green-600">20% off</span>
                      </div>
    
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
  )
}

export default Purchases
