import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary';
import courseRoute from './routes/course-route.js'   // global router of courses
import userRoute from './routes/user-route.js'      // global router of user
import adminRoute from './routes/admin-route.js'      // global router of admin
import orderRoute from './routes/order-route.js'
import cookieParser from 'cookie-parser';
import cors from "cors"

// middleware(all use() method)
const app=express()
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT",'DELETE'],
    allowedHeaders:["content-Type","Authorization"]
}))
app.use(fileUpload({  
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// define environment variable
dotenv.config()
const port=process.env.PORT || 3030;
const DB_URL=process.env.MONGODB_URL

// connect the database
try{
  await mongoose.connect(DB_URL);
  console.log('connect to mangodb')

}catch(error){
 console.log(error)
}

// define routes global
app.use("/course", courseRoute) 
app.use("/user",userRoute)
app.use("/admin",adminRoute)
app.use("/order",orderRoute)

 // Cloudinary Configuration code
  cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
  });
    
// run the server
app.listen(port,()=>{
  console.log(`server is runnig on http://127.0.0.1:${port}`)
})