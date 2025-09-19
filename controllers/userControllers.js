const fs=require("fs");
const User=require('../models/userModel');

exports.getAllUser=async(req,res,next)=>{
 const users=await User.find();
  res.status(200).json({
    status:"success",
    results:users.length,
    data:{
      users:users
    }
  })
}
//updateMe->only particular feild can be updated
const filterObj=(obj,...allowedFields)=>{
  const newObj={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) newObj[el]=obj[el];
  })
  return newObj;
}
exports.updateMe=async(req,res,next)=>{
  //1.create error if user updateing password
  try{
  if(req.body.password || req.body.passwordConfirm){
    return res.status(400).json({
      status:"fail",
      message:"this route is not for password update, please use /updatePassword"
    })
  }
  //2.update user data
  const filteredBody=filterObj(req.body,"name","email")
  const updateUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
    new:true,
    runValidators:true
  })
  //3.send response to client
  res.status(200).json({
    status:"success",
    data:{
      user:updateUser
    }
  })
  


} catch(err){
    return next(err);
  }
}

//delete me 
exports.deleteMe=async(req,res,next)=>{
  try{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
      status:"success",
      data:null 
    });

  }catch(err){
    return next(err);
  }
}
  
  



exports.CreateUser=(req,res)=>{
  res.status(500).json({
    status:"error",
    message:"Internal server Error"
  })
}
exports.getSingleUser=(req,res)=>{
  res.status(500).json({
    status:"error",
    message:"Internal server Error"
  })
}
exports.UpdateUser=(req,res)=>{
  res.status(500).json({
    status:"error",
    message:"Internal server Error"
  })
}
exports.DeleteUser=(req,res)=>{
  res.status(500).json({
    status:"error",
    message:"Internal server Error"
  })
}