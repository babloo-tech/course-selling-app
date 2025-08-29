import { Order } from "../models/order-model.js"
import { Purchase } from "../models/purchase.model.js"

export const orderData= async(req,res)=>{
    const order=req.body  // coming data from  ui body

    try{
     
      const orderInfo= await Order.create(order)   // create database of order
      console.log(orderInfo)
      const userId=orderInfo?.userId;
      const courseId=orderInfo.courseId;
      res.status(201).json({message:"Order Details",orderInfo})
      if(orderInfo){
        await Purchase.create({userId,courseId})
      }
    }catch(error){
      console.log("error in order",error)
      res.status(401).json({errors:"Error in order creation"})

    }
}