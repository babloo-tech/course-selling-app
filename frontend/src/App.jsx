
import {Routes,Route,Link, Navigate} from "react-router-dom"
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import  { Toaster } from 'react-hot-toast';
import Courses from "./components/Courses";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourses from "./admin/UpdateCourses";
import OurCourses from "./admin/OurCourses";
function App() {
  const user=JSON.parse(localStorage.getItem('user'))
  const admin=JSON.parse(localStorage.getItem('admin'))

  return (
    <div>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>} />
         <Route path='signup' element={<Signup/>}/>
         {/* other routes */}
         <Route path="/courses" element={<Courses/>}/>
         <Route path="/purchases" element={user ? <Purchases/>:<Navigate to={'/login'} />}/>
         <Route path="/buy/:courseId" element={<Buy/>}/>
           {/* Admin routes */}
         <Route path="/admin/signup" element={<AdminSignup/>}/>
         <Route path="/admin/login" element={<AdminLogin/>}/>
         <Route path="/admin/dashboard" element={admin ? <Dashboard/>:<Navigate to={'/admin/login'}/>}/>
         <Route path="/admin/create-course" element={<CourseCreate/>}/>
         <Route path="/admin/update-course/:id" element={<UpdateCourses/>}/>
         <Route path="/admin/our-courses" element={<OurCourses/>}/>
      </Routes>
       <Toaster />
    </div>
  )
}

export default App
