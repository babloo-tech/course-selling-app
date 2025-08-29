import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
  firstName:{type:String,required:true},
  lastName:{type:String,required:true},
  email:{type:String, unique:true, required:true},
  password:{type:String, unique:true ,requied:true}
})

export const Admin=mongoose.model("Admin",adminSchema) // Admin as a collection(table)