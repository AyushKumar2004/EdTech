const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User")

// auth
exports.auth=async(req,res,next)=>{
    console.log("Backend Me aa gaya hai:",req.header("Authorization")?.replace("Bearer ", ""));
    try {
        // extract token
        const token=req?.cookies?.token || req?.body?.token || req.header("Authorization")?.replace("Bearer ", "");
        // if token missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }
        console.log("TOKEN BACKEND  :",token)
        // verify the token
        try {
            //console.log("JWT_SECRET:", process.env.JWT_SECRET);

            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log("yeh hamara decode hai ji....",decode);
            req.user=decode;
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(201).json({
                success:false,
                message:"token is invalid",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}

// isstudent
exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}

// isInstructor
exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}

// isAdmin
exports.isAdmin=async(req,res,next)=>{
    console.log(req.user.accountType)
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}