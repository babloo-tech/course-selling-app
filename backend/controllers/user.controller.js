import bcrypt from "bcryptjs"
import z from "zod"
import jwt from "jsonwebtoken"
import {User} from "../models/user-model.js"
import config from "../config.js"
import { Purchase } from "../models/purchase.model.js"
import { Course } from "../models/course-model.js"

// singup user
export const signup=async (req,res)=>{
  const {firstName,lastName,email,password}=req.body //get all data form user

  const userSchema=z.object({
    firstName:z.string().min(3, {message:"first name atlest 3 character, "}),
    lastName:z.string().min(3, {message:"last name atlest 3 character, "}),
    email:z.string().email(),
    password:z.string().min(6, {message:"password atlest 6 character, "})
  })

  const validateData=userSchema.safeParse(req.body)
  if(!validateData.success){
    return res.status(400).json({errors:validateData.error.issues.map(err=>err.message)}) 
    //for collection=> errors(array) object but for individual=>message object
  }
  
   const hashPassword=await bcrypt.hash(password,10)
  try{
    const existingUser=await User.findOne({email})
   if(existingUser){
     return res.status(404).json({message:"User already exist"})
   }
   const newUser=new User({firstName,lastName,email,password:hashPassword})
   await newUser.save()
   res.status(201).json({message:"signup succeeded",newUser})
 
  }catch(error){
    res.status(500).json({message:"Error in signup"})
    console.log("error in singup",error)
  }
  
}

// login user
export const login= async(req,res)=>{
  const {email,password}=req.body
  try {
    const user = await User.findOne({ email: email });
    if(!user){
       return res.status(403).json({ errors: "Please enter correct email" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Please enter correct password" });
    }


        // jwt code generated token and save in cookie
        const token=jwt.sign(
          {id:user._id}, 
          config.JWT_USER_PASSWORD,
          {expiresIn:"1d"})

        const cookieOptions={  // use only security purpose(view all browser)
          expires:new Date(Date.now()+ 24*60*60*1000) ,// for 1 day
          httpOnly:true, // can't be access js directory
          secure:process.env.NODE_ENV==="production", // true for https only
          sameSite:'Strict' // prevents CSRF attact (cross-site cookies sending)
        }
        res.cookie("jwt",token,cookieOptions)

        res.status(201).json({message:"Login successful",user,token})
  
  }catch(error){
    res.status(500).json({message:"Error in login"})
    console.log("error in login",error)
  }
}
 
// logout user
export const logout=async (req,res)=>{
   try{
    res.clearCookie('jwt')
    res.status(200).json({message:"logout sucessfully"})

   }catch(error){
    res.status(500).json({message:"error get in logout"})
    console.log("error in logout",error)
   }
}

// all purchase course

export const purchases=async (req,res)=>{
  const userId=req.userId // gets  register user id

  try{
   const purchased=await Purchase.find({userId})
   let purchaseCourseId=[]
   for(let i=0; i < purchased.length; i++){
    purchaseCourseId.push(purchased[i].courseId) // store puchase courseId & courseId in Purchase db
 
   }
   
    const courseData=await Course.find({
      _id:{$in:purchaseCourseId}
    })
   res.status(200).json({purchased , courseData})
  }catch(error){
   console.log("error in purchase courses",error)
  }
}