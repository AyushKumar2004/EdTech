const RatingAndReviews=require("../models/RatingAndReviews")
const Course=require("../models/Course")
const mongoose=require("mongoose");

// createRating
exports.createRating=async(req,res)=>{
    try {
        // getUser id
        const userId=req.user.id;
        // fetch data from req.body
        const {rating,review,courseId}=req.body;
        // check if user is enrolled or not
        const courseDetails=await Course.findOne({_id:courseId,
            studentsEnrolled:{$elemMatch:{$eq:userId}}
        });

        //console.log("COURSE DETAIL>>>",courseDetails)

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"User does not enrolled in the course",
            })
        }
        // check if user is already review or not
        const alreadyReviewed=await RatingAndReviews.findOne({
                                                            user:userId,
                                                            course:courseId,
        });

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the user"
            })
        }

        // create review
        const ratingReview=await RatingAndReviews.create({
            rating,review,
            course:courseId,
            user:userId,
        });
        // update course with this rating
        await Course.findByIdAndUpdate(courseId,{
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },{new:true})
        // return res
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// getAverageRating
exports.getAverageRating=async(req,res)=>{
    try {
        // get course Id
        const courseId=req.body.courseId;
        // calculate average rating

        const result=await RatingAndReviews.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        // return rating
        if(result.length >0){
            return res.status(200).json({
                succesS:true,
                averageRating:result[0].averageRating
            })
        }

        // if not rating review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0 ,no rating is given till now",
            averageRating:0,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// getAllRating
exports.getAllRating=async(req,res)=>{
    try {
        const allReview=await RatingAndReviews.find({})
                                              .sort({rating:"desc"})
                                              .populate({
                                                path:"user",
                                                select:"firstName lastName email image",
                                              })
                                              .populate({
                                                path:"course",
                                                select:"courseName"
                                              }).exec();
        
        return res.status(200).json({
            success:true,
            message:"All reviews fetched Successfully",
            data:allReview,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// getAll course rating
exports.getAllCourseRating=async(req,res)=>{
    try {
        // get courseId
        const {courseId}=req.body;
        // validate
        if(!courseId){
            return res.status(404).json({
                success:false,
                message:"CourseId is not provided"
            })
        }
        // find all ratings using courseId
        const courseRatings=await RatingAndReviews.find({course:courseId});
        // validate
        if(courseRatings.length===0){
            return res.status(200).json({
                success:true,
                message:"No ratings are found for this course"
            })
        }
        // return res
        return res.status(200).json({
            success:true,
            message:"All ratings of the course is fetched"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}