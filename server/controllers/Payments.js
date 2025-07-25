const mongoose = require("mongoose");
const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail}=require("../mail/templates/paymentSuccessEmail");
const crypto=require("crypto");
const CourseProgress = require("../models/CourseProgress");

// capture the payment and intiate the razorpay order
// exports.capturePayment=async(req,res)=>{
//     try {
//         // getCourseId and userId
//         const {course_id}=req.body;
//         const userId=req.user.id;
//         // validation

//         // validCourse iD
//         if(!course_id){
//             return res.json({
//                 success:false,
//                 message:"Please provide valid course id"
//             })
//         }
//         // validation courseDetails
//         let course;
//         try {
//             course=await Course.findById(course_id);
//             if(!course){
//                 return res.json({
//                     success:false,
//                     message:"could not find the course"
//                 })
//             }
//             // user already pay for course
//             const uid=new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(200).json({
//                     success:false,
//                     message:"Student is already enrolled"
//                 })
//             }
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:"internal server error",
//                 error:error.message,
//             })
//         }
//         // user already pay for the same course
//         const amount=course.price;
//         const currency="INR";

//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId:course_id,
//                 userId,
//             }
//         }
//         // orderCreate
//         try {
//             // initiate the payment
//             const paymentResponse=await instance.orders.create(options);
//             console.log(paymentResponse);
//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount,
//             })
//         } catch (error) {
//             console.log(error);
//             res.json({
//                 success:false,
//                 message:"could not initiate order"
//             })
//         }
        
//     } catch (error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order"
//         })
//     }
// }

// // verify signature of razorpay and server

// exports.verifySignature=async(req,res)=>{
//     const webhooksecret="12345678";

//     const signature=req.headers["x-razorpay-signature"];

//     const shasum=crypto.createHmac("sha256",webhooksecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest=shasum.digest('hex');

//     if(signature===digest){
//         console.log("payment is authorized");

//         const {courseId,userId}=req.body.payload.payment.entity.notes;

//         try {
//             // fulfil the action
//             // find the course and enroll the student
//             const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},
//                 {$push:{
//                     studentsEnrolled:userId
//                 }},
//                 {new:true}
//             )

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course not found",
//                 })
//             }

//             console.log(enrolledCourse);

//             // find the student and added course to thier list of enrolled courses
//             const enrolledStudent=await User.findOneAndUpdate({_id:userId},
//                 {$push:{
//                     courses:courseId,
//                 }},
//                 {new:true}
//             );

//             // mail send kr dena
//             const emailResponse=await mailSender(enrolledStudent.email,
//                 "Congratu;lation from studynotion",
//                 "Congratulations,you are onbroaded into new studynotion course"
//             )

//             console.log(emailResponse);

//             return res.status(200).json({
//                 succesS:true,
//                 message:"Signature verified and course added",
//             })

//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request'
//         })
//     }
// }

// // Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const { orderId, paymentId, amount } = req.body
  
//     const userId = req.user.id
  
//     if (!orderId || !paymentId || !amount || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please provide all the details" })
//     }
  
//     try {
//       const enrolledStudent = await User.findById(userId)
  
//       await mailSender(
//         enrolledStudent.email,
//         `Payment Received`,
//         paymentSuccessEmail(
//           `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
//           amount / 100,
//           orderId,
//           paymentId
//         )
//       )
//     } catch (error) {
//       console.log("error in sending mail", error)
//       return res
//         .status(400)
//         .json({ success: false, message: "Could not send email" })
//     }
//   }
  
//   // enroll the student in the courses
// exports.enrollStudents = async (courses, userId, res) => {
//     if (!courses || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Provide Course ID and User ID" })
//     }
  
//     for (const courseId of courses) {
//       try {
//         // Find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnroled: userId } },
//           { new: true }
//         )
  
//         if (!enrolledCourse) {
//           return res
//             .status(500)
//             .json({ success: false, error: "Course not found" })
//         }
//         console.log("Updated course: ", enrolledCourse)
  
//         const courseProgress = await CourseProgress.create({
//           courseID: courseId,
//           userId: userId,
//           completedVideos: [],
//         })
//         // Find the student and add the course to their list of enrolled courses
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           {
//             $push: {
//               courses: courseId,
//               courseProgress: courseProgress._id,
//             },
//           },
//           { new: true }
//         )
  
//         console.log("Enrolled student: ", enrolledStudent)
//         // Send an email notification to the enrolled student
//         const emailResponse = await mailSender(
//           enrolledStudent.email,
//           `Successfully Enrolled into ${enrolledCourse.courseName}`,
//           courseEnrollmentEmail(
//             enrolledCourse.courseName,
//             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//           )
//         )
  
//         console.log("Email sent successfully: ", emailResponse.response)
//       } catch (error) {
//         console.log(error)
//         return res.status(400).json({ success: false, error: error.message })
//       }
//     }
//   }

//order initialte krne ke liye
exports.capturePayment=async(req,res)=>{

    const {courses}=req.body;
    const userId=req.user.id;

    if(courses.length===0){
      return res.json({
        success:false,
        message:"Please provide course id"
      })
    }

    let totalAmount=0;

    for(const course_id of courses){
      let course;
      try{
        course=await Course.findById(course_id);
        if(!course){
          return res.status(404).json({
            success:false,
            message:"Could Not find the course"
          })
        }
          const uid=new mongoose.Types.ObjectId(userId);
          if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
              success:false,
              message:"Student is Already Enrolled"
            })
          }

          totalAmount+=course.price;
      }catch(error){
          console.log(error);
          return res.status(500).json({
            success:false,
            message:"Internal Server Error"
          })
      }
    }

    const options={
      amount:totalAmount*100,
      currency:"INR",
      receipt:Math.random(Date.now()).toString(),
    }


    try{
      const paymentResponse=await instance.orders.create(options);
      console.log("PAYMENT RESONSE?>>>>",paymentResponse)
      res.json({
        success:true,
        message:paymentResponse
      })
    }catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }
}

//payment veryfy krne ke liye
exports.verifyPayment=async(req,res)=>{
    const razorpay_order_id=req.body?.razorpay_order_id;
    const razorpay_payment_id=req.body?.razorpay_payment_id;
    const razorpay_signature=req.body?.razorpay_signature;
    const courses=req.body?.courses;
    const userId=req.user.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
      return res.status(404).json({
        success:false,
        message:"Payment Failed"
      })
    }

    let body=razorpay_order_id+"|"+razorpay_payment_id;
    const expectedSignature=crypto
                            .createHmac("sha256",process.env.RAZORPAY_SECRET)
                            .update(body.toString())
                            .digest("hex")
    
    if(expectedSignature===razorpay_signature){
      //enroll karwao student
      await enrollStudents(courses,userId,res);

      return res.status(200).json({
        success:true,
        message:"Payment Verified"
      })
    }
    return res.status(500).json({
        success:false,
        message:"Payment Failed"
    })
}


const enrollStudents=async(courses,userId,res)=>{

    if(!courses || !userId){
        return res.status(400).json({
          success:false,
          message:"Please Provide data for Courses or userId"
        })
    }

    for(const courseId of courses){
      try {
        //find the course and enroll the student in it

        const enrolledCourse=await Course.findOneAndUpdate(
          {_id:courseId},
          {$push:{studentsEnrolled:userId}},
          {new:true}
        )

        if(!enrolledCourse){
          return res.status(404).json({
            success:false,
            message:"Course not found"
          })
        }

        const courseProgress=await CourseProgress.create({
          courseID:courseId,
          userId:userId,
          completedVideos:[],
        })

        //find the student and add the course in it in there list of courses
        const enrolledStudent=await User.findByIdAndUpdate(userId,{
          $push:{
            courses:courseId,
            courseProgress:courseProgress._id
          }
        },{new:true})

        //bache komail send kr denge
        const emailResponse=await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
        )

        //console.log("Email sent Successfully",emailResponse.response);

        return res.status(200).json({
          success: true,
          message: "Courses enrolled successfully",
        });

      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:false,
          message:"Internal server error"
        })
      }
    }

}


exports.sendPaymentSuccessEmail=async(req,res)=>{
    const {orderId,paymentId,amount}=req.body;

    const userId=req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
      return res.status(200).json({
        success:false,
        message:"Please provide all the fields"
      })
    }

    try {
      //student ko dhundho
      const enrolledStudent=await User.findById(userId);

      await mailSender(enrolledStudent.email,`Payment Recieved`,paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId))
    } catch (error) {
      console.log("error is sending mail",error);
      return res.status(500).json({
        success:false,
        message:"Could not send Email"
      })
    }
}