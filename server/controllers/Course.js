const Course=require("../models/Course");
const Category=require("../models/Category");
const User=require("../models/User");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const { uploadImageToCloudinary}=require("../utils/imageUploader");

// createCourse handler function
exports.createCourse=async(req,res)=>{
    try {
        
        // fetch data
        let {courseName,courseDescription,whatYouWillLearn,price,tag:_tag,category,status,instructions:_instructions}=req.body;
        // get thumbnail image
        const thumbnail=req.files.thumbnailImage;

        console.log("req.body--->",req.body);
        console.log("..Description--",courseDescription);

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        console.log("tag", tag)
        console.log("instructions", instructions)

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !thumbnail || !category || !instructions.length){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        // for status
        if(!status || status===undefined){
          status="Draft"
        }

        // check for instrucetor
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId,{accountType:"Instructor"});
        console.log("Instructor details:",instructorDetails);
        // TODO verify user_id and instructor_id is same

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details not found",
            })
        }

        // check given tag is valid or not
        const categoryDetails=await Category.findById(category);
        
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message: "Category Details not found",
            })
        }

        // upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // create an entry fgor new couyrse
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions,
        })

        // add the new cousrse to the userschema of instructor
        await User.findByIdAndUpdate({_id:instructorDetails._id},{
            $push:{
                courses:newCourse._id
            }
        },{new:true});

        // update the category schema
        await Category.findByIdAndUpdate({_id:categoryDetails._id},{
            $push:{
                course:newCourse._id
            },
        },{new:true});

        // return respponse
        return res.status(200).json({
            success:true,
            message:"course created successfully",
            data:newCourse
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        })
    }
}


// getAllCourses handler function

exports.showAllCourses=async(req,res)=>{
    try {
        
        const allCourses=await Course.find({status:"Published"},{courseName:true,price:true,thumbnail:true,instructor:true,ratingAndReviews:true,studentsEnrolled:true}).populate("Instructor").exec();

        return res.status(200).json({
            success:true,
            message:"adta for all Courses fetched successfully",
            data:allCourses,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch course data",
            error:error.message,
        })
    }
}

exports.getCourseDetails=async(req,res)=>{
    try {
        // courseId
        const {courseId}=req.body;

        //find courseDetails
        const courseDetails=await Course.findOne({ _id:courseId}).populate(
            {
                path:"instructor",
                populate:{
                    path:"additionalDetails"
                }
            }
        )
        .populate("category")
        //.populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec();

        // validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course the ${courseId}`,
            })
        }
        console.log("this is coursec",courseDetails.courseContent)
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        // return res
        return res.status(200).json({
            success:true,
            meassge:"Course Details fetched successfully",
            data:{
              courseDetails,
              totalDuration,
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



// revision necessary
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
}


exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      console.log("ERROR--------",error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}


exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
      console.log("updates...",updates)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}
  