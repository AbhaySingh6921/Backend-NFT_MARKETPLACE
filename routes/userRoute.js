
const express=require("express");
const userControllers=require("../controllers/userControllers")
const authControllers=require("../controllers/authControllers")

const router=express.Router();

router.post('/signup',authControllers.signup);
router.post('/login',authControllers.login);
router.post('/forgetPassword',authControllers.forgetPassword);
router.patch('/resetPassword/:token',authControllers.resetPassword);
router.patch('/updatePassword',authControllers.protect,authControllers.updatePassword);
router.patch('/updateMe',authControllers.protect,userControllers.updateMe);
router.delete('/deleteMe',authControllers.protect,userControllers.deleteMe);



//user router
router.route('/').get(userControllers.getAllUser).post(userControllers.CreateUser)
router.route('/:id').get(userControllers.getSingleUser).delete(userControllers.DeleteUser).patch(userControllers.UpdateUser);

module.exports=router;