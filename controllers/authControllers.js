//here in this file  build all logic where user login or not  connecetd with database or not
const crypto=require('crypto');
const User=require('../models/userModel');
const sendEmail=require('../utils/email'); //import email utility to send email
const jwt=require("jsonwebtoken")
const{ promisify }=require("util");
//CREATE TOKEN
const signToken=id=>{
   
    
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN})
    
}
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("jwt",token,{
    expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure:true,
    httpOnly:true,
  })

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};


    

//SIGNUP
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        //newuser must be admin 
        // const newUser = await User.create({
        //     name:req.body.name,
        //     email:req.body.email,
        //     password:req.body.password,
        //     passwordConfirm:req.body.passwordConfirm,
        // });
        // Generate JWT token
         createSendToken(newUser, 201, res);
        
    } catch (err) {
        // Send error to global error handling middleware
        next(err);
    }
};
//LOGIN USER
exports.login=async(req,res,next)=>{
    try{
     const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            status:"fail",
            message:"plz provide email and password"
        })
    }
    //checking password is same or not
    const user=await User.findOne({email}).select("+password");//because password is hidden in db so we use slecet.(+password
    if(!user ||!(await user.correctPassword(password,user.password))){//password->postman,user.password-->stored password in db
      return res.status(400).json({
        status:"failed",
        message:"password & email  not match"
      })
    }

    createSendToken(user, 200, res);
        

    } catch(err){
        next(err);
    }
}
//PROTECTING ROUTER GIVE ACCESS TO AUTHENTICATED USER
//this middleware will be used to protect all the routes that we want to protect
exports.protect=async(req,res,next)=>{
  
  try{
    //1.check token
   let token;
   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token=req.headers.authorization.split(" ")[1]; //Bearer token
   }
   if(!token){
    return res.status(404).json({
        status:"fail",
        message:"you are not logged in! please login to get access"
    })
   }
  //2.validate token
   const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);//promisify is used to convert callback function to promise
//    console.log(decoded); 
  //3.user exist or not
  const currentUser =await User.findById(decoded.id);
  if(!currentUser){
    return res.status(401).json({
        status:"fail",
        message:"the user belonging to this token does no longer exist"
    })
  }

  //4.change password or not
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return res.status(401).json({
            status:"fail",
            message:"user recently changed password! please login again"
        })
    }
    req.user=currentUser; //attach user to request object
    next();
}catch(err){
    return res.status(401).json({
        status:"fail",
        message:"invalid token"
    })
  }
  
}
//RESTRICT TO SPECIFIC USER//only specific user can access this route
exports.reStrictTo = (...roles) => {
    return (req, res, next) => {
        // // --- CRITICAL DEBUGGING LOG ---
        console.log('--- AUTHORIZATION CHECK ---');
        console.log('Allowed Roles:', roles);
        console.log('User Object on Request:', req.user); // Log the entire user object
        console.log('User Role being checked:', req.user.role);
        console.log('---------------------------');
        //-----------------------------

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "You do not have permission to  delete this resource",
            });
        }

        next();
    };
};
//  FORGET PASSWORD
exports.forgetPassword = async (req, res, next) => {
    let user;
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that email",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // ✅ Save token to DB

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:\n${resetURL}\nIf you didn’t forget your password, ignore this email.`;

    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: "fail",
      message: "There was an error sending the email. Try again later.",
    });
  }
};


//RESET PASSWORD->this f called when user click on the link in the email with the token and sumit new pas
exports.resetPassword = async (req, res, next) => {
  // 1. Hash the token from URL
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2. Find user with this token and check if token is not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
  }

  // 3. Set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 4. Update passwordChangedAt and save
  await user.save();

  // 5. Log the user in with new JWT
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token: token,
    message: "Password reset successfully",
  });
};
//UPDATING PASSWORD
exports.updatePassword=async(req,res,next)=>{
    //1.get user who want to update the pass
    const user=await User.findById(req.user.id).select("+password");
    //here user include  the User schema model
    //2.check if the posted password by user is correct or not
    if(!await user.correctPassword(req.body.passwordCurrent,user.password)){
        return res.status(401).json({
            status:"fail",
            message:"your current password is wrong"
        })
    }
    //3.update the password
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    //4.log user in, send JWT
    const token=signToken(user.id);
    res.status(200).json({
        status:"success",
        token:token,
        message:"password updated successfully"
    })


}