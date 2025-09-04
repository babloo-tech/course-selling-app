import { Course } from "../models/course-model.js"; // here Course is consume all data 
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

 // 1. create course function
 export const createCourse = async (req, res) => {  
  const adminId=req.adminId; // take a admin middleware (checked which admin is logged in)
  const {title,description,price}= req.body;

  try{
    if(!title || !description || !price ){
        return res.status(400).json({errors:'All fields are required'})
    }

    // load image here code...

    const {image}=req.files  
    if(!req.files || Object.keys(req.files).length===0){
       return res.status(400).json({error:'No files uploaded'})
    }

      const allowdFormat=["image/jpeg" , "image/png"]

       if(!allowdFormat.includes(image.mimetype)){
         return res.status(400).json({error:'Invalid file formate: only PNG and JPG are allowed'})
     }

     // Cloudinary code 

     const cloud_response= await cloudinary.uploader.upload(image.tempFilePath)
      if(!cloud_response || cloud_response.error){
        return res.status(400).json({errors:'Error uploaded file to cloudinary '})
      }

     // load data into databases

     const courseData={
      title,
      description,
      price,
      image:{
         public_id:cloud_response.public_id,
         url:cloud_response.url
      },
      creatorId:adminId
     }

    const course=await Course.create(courseData)
    res.json({
      message:'Course created successfully',
      course
    })

  }catch(error){
    console.log(error)
    res.status(500).json({errors:'Error creathing course'})
  }
};

//2.updating courses
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body; // ✅ only text comes in body

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    let imageData = courseSearch.image; // keep old image if no new one(take image)

    //  handle new image if uploaded
    if (req.files && req.files.image) {
      const file = req.files.image;

      // upload to cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "courses",
      });

      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    

    const course = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      { title, description, price, image: imageData }, // image data store in imageData
    );

      if (!course) {
      return res.status(404).json({ errors: "can't update, created by other admin" });
    }
    res.status(200).json({ message: "Course updated successfully", course: course });

  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("error in course updated", error);
  }
};


 // 3.delete course function
export const deleteCourse = async (req,res)=>{  
  const adminId=req.adminId; 
  const {courseId}=req.params

  try{
    const course=await Course.findOneAndDelete({_id:courseId,creatorId:adminId}) // based on delete
    if(!course){
      return res.status(404).json({errors:"cant't update, created by other admin"})
    }
     res.status(204).json({message:"course deleted sucessfully"})

  }catch(error){
    res.status(500).json({message:"Error in course deleting"})
    console.log("Course deleted error")
  }
}

 // 4. get courses function

export const getCourse = async (req,res)=>{     
   const courses=await Course.find({})

  try{
       if(!courses){
       return res.status(404).json({errors:"courses are not found"})
        }else{
         res.status(201).json({courses})
   }

  }catch(error){
    res.status(500).json({erros:"error in  getting courses"})
    console.log("error to get courses",error)
  }
}

// 5.get coursed by ID based....
export const  courseDetails = async (req,res)=>{
 
  const {courseId}=req.params
  try{
      const course=await Course.findById(courseId)
      if(!course){
        return res.status(404).json({error:"error is getting course details"})
      }
      res.json(course)
  }catch(error){
    res.status(500).json({error:"error is getting course detalis"})
    console.log("error in get course course details")
  }

}

// use stripe for payment gateway
import Stripe from 'stripe'
import config from "../config.js";
const stripe=new Stripe(config.STRIPE_SECRET_KEY)

// 6. buy courses by course id
export const buyCourses=async (req,res)=>{
  const {userId}=req;
  const {courseId}=req.params;

  try{
    
    const course=await Course.findById(courseId)
    if(!course){
      return res.status(400).json({errors:"course not found"})
    }
    const existingPurchase=await Purchase.findOne({userId,courseId})
    if(existingPurchase){
      return res.status(400).json({errors:"user has already purchased it course"})
    }

    // strip payment code goes here!
    const amount=course.price;
    const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types:["card"]
  });

     //create purchase collection
  
     res.status(201).json({
      message:"course purchase successfully",
      course,
      clientSecret: paymentIntent.client_secret
    })
  }catch(error){
    res.status(500).json({errors:"error in course buying"})
    console.log("Error in course buying",error)
  }
}