import bcrypt from "bcryptjs"
import config from "../config.js"
import jwt from 'jsonwebtoken'
import {Admin} from "../models/admin-model.js"
import z from "zod"

// singup Admin
export const signup=async (req,res)=>{
  const {firstName,lastName,email,password}=req.body //get all data form admin form

  const adminSchema=z.object({
    firstName:z.string().min(3, {message:"first name atlest 3 character"}),
    lastName:z.string().min(3, {message:"last name atlest 3 character"}),
    email:z.string().email(),
    password:z.string().min(6, {message:"password atlest 6 character"})
  })

  const validateData=adminSchema.safeParse(req.body)
  if(!validateData.success){
    return res.status(400).json({errors:validateData.error.issues.map(err=>err.message)})
  }
  
   const hashPassword=await bcrypt.hash(password,10) //use bcrypt only for hash password
  try{
    const existingUser=await Admin.findOne({email})
   if(existingUser){
     return res.status(404).json({message:"admin already exist"})
   }
   const newAdmin=new Admin({firstName,lastName,email,password:hashPassword})
   await newAdmin.save()
   res.status(201).json({message:"signup succeeded",newAdmin})
 
  }catch(error){
    res.status(500).json({errors:"Error in signup"})
    console.log("error in singup",error)
  }
  
}

  // login Admin
export const login= async(req,res)=>{
  const {email,password}=req.body
  try {
    const admin = await Admin.findOne({ email: email });
    if(!admin){
       return res.status(403).json({ errors: "Please enter correct email" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Please enter correct password" });
    }


        // jwt code generated token and save in cookie
        const token=jwt.sign(
          {id:admin._id}, 
          config.JWT_ADMIN_PASSWORD,
          {expiresIn:"1d"})

        const cookieOptions={  
          expires:new Date(Date.now()+ 24*60*60*1000) ,
          httpOnly:true, 
          secure:process.env.NODE_ENV==="production", 
          sameSite:'Strict' 
        }
        res.cookie("jwt",token,cookieOptions)

        res.status(201).json({message:"Login successful",admin,token})
  
  }catch(error){
    res.status(500).json({message:"something went wrong in login"})
    console.log("error in login",error)
  }
}
 
// logout Admin
export const logout=async (req,res)=>{
   try{
    res.clearCookie("jwt")
    res.status(200).json({message:"logout sucessfully"})

   }catch(error){
    res.status(500).json({error:"error get in logout"})
    console.log("error in logout",error)
   }
}
