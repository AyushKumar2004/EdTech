const express=require("express");
const app=express();

const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");
const contactUsRoute=require("./routes/ContactUs");

const database=require("./config/database");
const cookieParser=require('cookie-parser');
const cors=require('cors');
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");

dotenv.config();
const PORT=process.env.PORT || 5000;

// database connect
database.connect();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:process.env.FRONTEND_URL,
        credentials:true,
    })
)
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp",
    }
))

// cloudinary
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// default Route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your Server is up and running.."
    })
})

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})