
import  { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";


function Home() {
  const  BACKEND_URL= import.meta.env.VITE_API_URL;
  console.log(BACKEND_URL)
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(1); // default small screen

  //  Detect viewport width
  useEffect(() => {
       console.log(courses)
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width >= 1280) setSlidesToShow(4);
      else if (width >= 1024) setSlidesToShow(3);
      else if (width >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    };

    updateSlides(); // run on mount
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  //  Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  // token
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error in logout", error);
      toast.error(error.response?.data?.error || "Error in logout");
    }
  };

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(response.data.courses);
     
      } catch (error) {
        console.log("error in fecthCourse", error);
      }
    };
    fetchCourses();
  }, []);

  
// 
//bg-gradient-to-r from-black to-blue-950
  return (
    <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-blue-950 ">
      <div className="sm:h-screen text-white container mx-auto p-12 ">
        {/*Header*/}
        <header className="flex justify-between items-center ">
          <div className="flex items-center space-x-2 ">
            <img src={logo} alt="home image" className="h-10 w-10 rounded-full" />
            <h1 className="text-lg sm:text-2xl font-bold text-orange-500 ">
              CourseHub
            </h1>
          </div>
          <div className="space-x-3  sm:space-x-5">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-blue-800 py-2 px-4 border border-white text-white rounded cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent hover:bg-blue-800 py-2 px-4 border border-white text-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent hover:bg-blue-800 py-2 px-4 border border-white text-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/*Main Section */}
        <section className="text-center py-4 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-500 mb-3">
            CourseHub
          </h1>
          <p className="text-gray-400">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="mt-5 space-x-4 flex  justify-center align-center ">
            <Link
              to={"/courses"}
              className=" block w-50 sm:inline px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-white duration-300 hover:text-black"
            >
              Explore Courses
            </Link>
            <Link
              to={"https://online-courseapp.vercel.app/"}
              className=" block  w-50  sm:inline px-6 py-3 bg-white text-black font-semibold rounded hover:bg-green-500 duration-300 hover:text-black"
            >
              Courses Videos 
            </Link>
          </div>
        </section>

        {/*  Slider Section */}
        <section>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-3">
                <div className="rounded-2xl relative flex-shrink-0 h-60 transition-transform duration-300 transform hover:scale-105 bg-gray-900 hover:shadow-lg shadow-orange-500/50">
                  <div className="overflow-hidden">
                    <img
                      className="h-25 items-center w-full object-contain"
                      src={course.image.url}
                      alt={course.title}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-xl mb-8 font-bold text-white">
                      {course.title}
                    </h2>
                    <Link
                      to={`/courses`}
                      className="mt-4 bg-orange-500 text-white py-4 px-6 rounded-full hover:bg-blue-500 duration-300 cursor-pointer"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        
        <hr />
        {/* Footer */}
        <footer className="my-6">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  CourseHub
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/bablookumar.chaurasiya.12">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="https://www.instagram.com/its_babloo_chaurasiya/">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="https://x.com/home">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">connects</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  youtube- learn coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  telegram- learn coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github- learn coding
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                copyrights &#169; 2024
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;

