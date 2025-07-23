const express=require("express");
const router=express.Router();

const {signUp,login,changePassword,sendOTP}=require("../controllers/Auth");
const {resetPassword,resetPasswordToken}=require("../controllers/ResetPassword");
const {auth}=require("../middlewares/auth");


router.post('/signup',signUp);
router.post('/login',login);
router.post('/sendotp',sendOTP);
router.post('/reset-password-token',resetPasswordToken);
router.post('/reset-password',resetPassword)

router.post('/change-password',auth,changePassword);

module.exports=router;