const User=require("../models/User");
const Profile=require("../models/Profile")
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//sendOTP
exports.sendOTP=async(req,res)=>{
    try{
        // fetch email from request ki body
        const {email}=req.body;

        // check if user already exist
        const checkUserPresent=await User.findOne({email});

        // if user already exist,then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered"
            })
        }
        // generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("Otp generated:",otp);

        // check uniqueotp or not

        let result=await OTP.findOne({otp:otp});

        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
            result=await findOne({otp:otp});
        }

        const otpPayload={email,otp};

        // create an entry for otp
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);

        // return response successful
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}

// signup
exports.signUp=async(req,res)=>{

    try {
        // data fetch from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        }=req.body;
        // validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        // 2 password match krlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword value does not match ,please try again",
            });
        }
        // check user already exist or not
        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is Already registered",
            });
        }

        // find most recent otp stored for the user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // validate Otp
        if(recentOtp.length==0){
            // otp not found
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid Otp",
            })
        }

        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        // hash password
        const hashedPassword=await bcrypt.hash(password,10);

        // entry create in DB

        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user=await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })

        // return res
        return res.status(200).json({
            success:true,
            message:"User id registered Successfully",
            user,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered,please try again",
        })
    }
    
}

// login
exports.login=async(req,res)=>{
    try{
        // get data from req.body
        const {email,password}=req.body;
        // vaildation karo
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required,please try again",
            })
        }
        // user check exist otr not
        const user=await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered,please signUp"
            })
        }
        // generate jwt after password matching

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token;
            user.password=undefined;

            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }

            // create cookie and send response
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged In Successfully"
            })
        }else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure please try again"
        })
    }
}

// changePassword
exports.changePassword=async(req,res)=>{
    try {
        // get data from req.body
        // get oldPassword,newPassword,confirmPassword
        const {oldPassword,confirmNewPassword,newPassword}=req.body;
        // validation
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(404).json({
                success:false,
                message:"Please fill the required fields"
            })
        }

        if(newPassword!==confirmNewPassword){
            return res.status(401).json({
                success:false,
                message:"password didnt match"
            })
        }

        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }

        const isMatch=await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(403).json({
                success:false,
                message:"password doesnot matched"
            })
        }

        // Take user
        const email=req.user.email;

        // hashNewPassord
        const hashedPassword=await bcrypt.hash(newPassword,10);

        // updatepwd in Db
        const updatedUserPasswordDetails=await User.findByIdAndUpdate({_id:user._id},{
            password:hashedPassword,
        },{new:true});

        if(!updatedUserPasswordDetails){
            return res.status(401).json({
                success:false,
                message:"An error occured will updating password"
            })
        }
        // send email-password updated
        try {
            const info=await mailSender(email,`Password Changed`,passwordUpdate(email,user.firstName));
            console.log('mail sended',info);
        }catch(error){
            console.log('error occured while sending mail',error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
        // return response
        return res.status(200).json({
            success:true,
            message:"password updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succesS:false,
            message:error.message,
        })
    }
}