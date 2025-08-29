//function only verify token for admin 

import jwt from "jsonwebtoken"
import config from "../config.js";

function adminMiddlerware(req, res,next){
  
  const authHeader=req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({errors:"No token provide"})
  }
  const token =authHeader.split(" ")[1] //split(" ")=["Bearer","token"] based on space

  try{
     const decoded=jwt.verify(token, config.JWT_ADMIN_PASSWORD)
     req.adminId=decoded.id   // used this admin id in controller
   next() // send to controller
  }catch(error){
    res.status(401).json({errors:"invalid token or expired"})
    console.log("invalid token ro expired ")
}
}

export default adminMiddlerware