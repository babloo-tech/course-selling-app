import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  firstName:{type:String,required:true},
  lastName:{type:String,required:true},
  email:{type:String, unique:true, required:true},
  password:{type:String, unique:true ,requied:true}
})

export const User=mongoose.model("User",userSchema) // User as a collection(table)