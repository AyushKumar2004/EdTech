const Category=require("../models/Category");
const Course = require("../models/Course");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory=async(req,res)=>{
    try {
        // fetch data
        const {name,description}=req.body;

        // validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        // create entry in DB
        const categoryDetails=await Category.create({
            name:name,
            description:description,
        });

        console.log(categoryDetails);

        return res.status(200).json({
            success:true,
            message:"category created successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// getAlltags handler function
exports.showAllCategory=async(req,res)=>{
    try {
        const allCategory=await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All category returned successfully",
            data:allCategory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// category page details handler function
exports.categoryPageDetails=async(req,res)=>{
    try {
        // get category id
        const {categoryId}=req.body;
        // fetch all courses for specified category id
        const selectedCategory=await Category.findById(categoryId).populate("course").exec();
        // validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found"
            })
        }
        // get ccourses for different different categories
        const categoriesExceptSelected=await Category.find({_id: {$ne:categoryId}});
        let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
        .populate({
            path: "course",
            match: { status: "Published" },
            })
        .exec()

        // get top selling courses
        // const topCourses=await Course.aggregate([
        // {
        //         $project:{
        //         courseName:"$courseName",
        //         studentsEnrolled:{$size:{ $ifNull: ["$studentsEnrolled", []] }}
        //     }
        // },
        // {$sort:{studentsEnrolled:-1}},
        // {$limit:10}  
        // ])

        // approach:-2
        const allCategory=await Category.find()
                                        .populate(
                                            {
                                                path:"course",
                                                $match:{status:"Published"},
                                                populate:{
                                                    path:"instructor"
                                                }
                                            }
                                        ).exec();
                                        
        const allCourses=allCategory.flatMap((category)=>category.course);
        
        const mostSellingCourses=allCourses.sort((a,b)=>
            b.studentsEnrolled.length-a.studentsEnrolled.length
        ).slice(0,10);

        console.log("selected category",selectedCategory)
        console.log("differentCategory.....",differentCategory)
        console.log("mostSellingCourses............",mostSellingCourses)

        // return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
                mostSellingCourses
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