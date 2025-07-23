const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create subsection
exports.createSubSection=async(req,res)=>{
    console.log("req body....",req.body);
    try {
        // fetch data from req.body
        const {sectionId,title,description}=req.body;
        console.log("req.body try....",req.body);
        // extract file
        const video=req.files.video

        console.log("video...",video)
        // valiadtion
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        // upload video to cloudinary
        const videoDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        // create a sub section
        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:`${videoDetails.duration}`,
            description:description,
            videoUrl:videoDetails.secure_url
        })
        // update sectipon with this sub section
        const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:true}).populate("subSection").exec();//populatequery
        // return response
        return res.status(200).json({
            success:true,
            message:"sub section created successfully",
            data:updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internalserver error",
            error:error.message
        })
    }
}

// update subScetion
exports.updateSubSection=async(req,res)=>{
    try {
        // get data 
        const {sectionId,subSectionId,title,description}=req.body;
        console.log("req body...",req.body)
        // validate
        // subScetion fetch karo
        const subSection=await SubSection.findById(subSectionId);
        if( !subSection){
            return res.status(404).json({
                success:false,
                message:"subSection not found",
            })
        }
        // subsection me dalo
        if(title!==undefined)
            subSection.title=title;
        if(description!==undefined)
            subSection.description=description;
        // req.files.videoDeatisl fetch karo aur cloudinary pe dalo agar hai toh
        if(req.files && req.files.VideoFile !== undefined){
            const videoDetails=await uploadImageToCloudinary(req.files.video,process.env.FOLDER_NAME);
            subSection.videoUrl=videoDetails.secure_url;
            subSection.timeDuration=`${videoDetails.duration}`
        }
        // .save()
        await subSection.save();
        // return response
        const updatedSection=await Section.findById(sectionId).populate("subSection")

        return res.json({
            success:true,
            message:"SubSection updated successfully",
            data:updatedSection
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// delete subScetion
exports.deleteSubSection=async(req,res)=>{
    try {
        // get subsection id and section id
        const {sectionId,subSectionId}=req.body;

        if(!sectionId || !subSectionId){
            return res.json({
                sucess:false,
                message:error.message,
            })
        }
        
        // delete from section 
        const section=await Section.findByIdAndUpdate(sectionId,
            {
                $pull:{
                    subSection:subSectionId,
                }
            },
            {new:true}
        )

        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }
        // delete from subsection
        await SubSection.findByIdAndDelete(subSectionId);
        // return rsponse

        const updatedSection=await Section.findById(sectionId).populate("subSection")

        return res.status(200).json({
            success:true,
            message:"Subsection deleted successfully",
            data:updatedSection
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"unable to delte sub section successfully"
        })
    }  
}