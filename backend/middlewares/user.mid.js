//function only verify token for user
import jwt from "jsonwebtoken"
import config from "../config.js";

function userMiddlerware(req, res,next){
  
  const authHeader=req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({errors:"No token provide"})
  }
  const token =authHeader.split(" ")[1] //split(" ")=["Bearer","token"] based on space

  try{
     const decoded=jwt.verify(token, config.JWT_USER_PASSWORD)
     req.userId=decoded.id   // send to controller
   next() // send to countroller
  }catch(error){
    res.status(401).json({errors:"invalid token or expired"})
    console.log("invalid token ro expired ")
}
}

export default userMiddlerware