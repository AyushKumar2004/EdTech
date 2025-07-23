const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection=require("../models/SubSection");

exports.createSection=async(req,res)=>{
    try {
        // data fetch
        const {sectionName,courseId}=req.body;
        console.log("Section....",req.body);
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing property"
            })
        }
        // section create
        const newSection=await Section.create({
            sectionName
        })
        // course ke schema ke under update krna padega
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id
            }
        },
        {new:true}).populate(
            {
                path:"courseContent",
                populate:{
                    path:"subSection"
                }
            }
        ).exec();//use populate such that ypou can see sectiona nd subsection both in the updated cousedetails
        // return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unavailable to create section please try again",
            error:error.message
        })
    }
}

exports.updateSection=async(req,res)=>{
    try {
        // data input
        const {sectionName,sectionId,courseId}=req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing property"
            })
        }
        // update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        const course=await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        }).exec();
        // return res
        return res.status(200).json({
            success:true,
            message:"Section Updated successfully",
            data:course
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section please try again",
            error:error.message,
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try {
        // getID
        const {sectionId,courseId}=req.body;
        // find by id and delete
        const section=await Section.findById(sectionId);

        const courseDetails=await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent:sectionId
            }
        })

        if(!section){
            return res.status(400).json({
                success:false,
                message:"No section found"
            })
        }

        await SubSection.deleteMany({
            _id:{
                $in:section.subSection,
            }
        })
        // do we need to delete the entry from the schema


        await Section.findByIdAndDelete(sectionId);

        const course=await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })

        return res.status(200).json({
            success:true,
            data:course,
            message:"section deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section please try again",
            error:error.message,
        })
    }
}