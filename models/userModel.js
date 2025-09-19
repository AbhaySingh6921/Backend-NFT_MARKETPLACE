const mongoose=require("mongoose");
const crypto=require("crypto");
const validator=require("validator");
const bcrypt=require("bcryptjs");
//name,email,photo,password,role
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        lowercase:true,
        validator:[validator.isEmail,"Please enter a valid email address"],

    },
    photo:{
        type:String,

    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:8,
        select:false, //this will not show password in the response

    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm your password"],
        //for confirm pssword
        validate:{
            validator:function(el){
                return el===this.password;
            },
            message:"Passwords are not the same",
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false,
    } , 
    role:{
        type:String,
        enum:["user","creator","admin","guide"],
        default:"user",
    }


});

//use for the encryption of password //this run before the userschema model is saved
userSchema.pre("save", async function(next) {
    // Only run this function if the password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field so it's not persisted to the DB
    this.passwordConfirm = undefined;
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1s as a buffer
    }

    

    next();
});
//checks for the password is same or not with encrypted for each user
userSchema.methods.correctPassword=async function(
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword)
};
// checks if the password was changed after the JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        // // --- ADD THESE LOGS ---
        // console.log('--- PASSWORD CHECK ---');
        // console.log('Password Changed Timestamp:', changedTimestamp); // The time the password was changed
        // console.log('JWT Timestamp:', JWTTimestamp);           // The time the token was issued
        // console.log('Is token older?', JWTTimestamp < changedTimestamp);
        // console.log('----------------------');
        // // --------------------

        return JWTTimestamp < changedTimestamp;
    }
    // If password was never changed
    return false;
};

// Generate a password reset token for the forget password functionality
userSchema.methods.createPasswordResetToken = function() {
    const resetToken=crypto.randomBytes(32).toString("hex");
    // Hash the token before saving it to the database
    this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    // Set the expiration time for the token
    this.passwordResetExpires=Date.now() + 10 * 60 * 1000; // 10 minutes from now
    // Return the plain token to send to the user
    return resetToken;
}
//save the passswrd after reset the password
userSchema.pre("save",function(next){
    if(!this.isModified("password")|| this.isNew) return next();
    this.passwordChangedAt=Date.now()-1000; // Subtract 1 second to ensure the JWT is issued after the password change
    next();
})
// for the delete user so that after deleting the user not show after fetching all the users but it is still in the database
userSchema.pre(/^find/,function(next){
     //this.find({active:true});
     this.find({active:{$ne:false}});// $ne means not equal to false
    next();
});
const User=mongoose.model("User",userSchema);
module.exports=User;