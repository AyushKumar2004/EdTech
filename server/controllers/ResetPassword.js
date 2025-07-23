const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt")
const crypto=require("crypto");

// resetPassword token
exports.resetPasswordToken=async(req,res)=>{
    
    try {
        // get email from req.body
        const {email}=req.body;
        // check user for this email ,email validation
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your email is not registered with us"
            })
        }
        // generate token
        const token=crypto.randomBytes(20).toString("hex");
        // user update by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000
        },{new:true});
        // create url
        const url=`http://localhost:3000/update-password/${token}`
        // send mail containg url
        const info=await mailSender(email,"Passowrd Reset Link",
            `Password Reset Link:${url}`
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Email sent Successfull,please check email and change password",
            info
        })

        }catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:"Something went wrong while reset password"
            })
        }
}


// resetPassword
exports.resetPassword=async(req,res)=>{
    try {
        // data fetch
        const {password,confirmPassword,token}=req.body
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"password not matching"
            })
        }
        // getUser details from db using token
        const userDetails=await User.findOne({token:token});
        // if no entry->invalid token
        if(!userDetails){
            return res.json({
                succesS:false,
                message:"Token is invalid",
            })
        }
        // token time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token is expired,please regenerate your token",
            })
        }
        // hashPassword
        const hashedPassword=await bcrypt.hash(password,10);
        // password ko update
        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},{new:true}
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Passsword reset successful"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating password"
        })
        
    }
}