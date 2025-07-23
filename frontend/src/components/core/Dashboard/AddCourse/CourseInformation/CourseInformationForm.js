import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';
import RequirementField from './RequirementField';
import IconButton from '../../../../common/IconButton';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';
import ChipInput from './ChipInput';
import Upload from '../Upload';

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors}
    }=useForm();

    const {token}=useSelector((state)=>state.auth);

    const dispatch=useDispatch();
    const {course,editCourse}=useSelector((state)=>state.course);

    const[loading,setLoading]=useState(false);
    const [courseCategories,setCourseCategories]=useState([]);

    useEffect(()=>{
        const getCategories=async()=>{
            setLoading(true);
            const categories=await fetchCourseCategories();
            console.log(categories)
            if(categories.length>0){
                setCourseCategories(categories);
            }
            setLoading(false);
        }

        if(editCourse){
            setValue("courseTitle",course.courseName);
            setValue("courseShortDesc",course.courseDescription);
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }

        getCategories();
    },[])

    const isFormUpdated=()=>{
        const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        if (
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !==
                course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ) {
            return true
        }
            return false
    }

    const onSubmit=async(data)=>{
        console.log("data--->",data)
        if(editCourse){
            const currentValues = getValues()
            console.log("changes after editing form values:", currentValues)
            if(isFormUpdated()){
                    const currentValues=getValues();
                    const formData=new FormData();

                    formData.append("courseId",course._id);

                    if(currentValues.courseTitle !== course.courseName){
                        formData.append("courseName",data.courseTitle);
                    }
                    if(currentValues.courseShortDesc !== course.courseDescription){
                        formData.append("courseDescription",data.courseShortDesc);
                    }
                    if(currentValues.coursePrice !== course.price){
                        formData.append("price",data.coursePrice);
                    }
                    if(currentValues.courseBenefits !== course.whatYouWillLearn){
                        formData.append("whatYouWillLearn",data.courseBenefits);
                    }
                    if(currentValues.courseCategory._id !== course.category._id){
                        formData.append("category",data.courseCategory);
                    }
                    if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                        formData.append("instructions",JSON.stringify(data.courseRequirements));
                    }

                    setLoading(true);
                    const result=await editCourseDetails(formData,token);
                    setLoading(false);
                    if(result){
                        setStep(2);
                        dispatch(setCourse(result))
                    }
                }else{
                    toast.error("No Changes made to the form")
                }
                return;
        }
        const formData=new FormData();
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        console.log("Reviewinfg formdata--",formData);
        setLoading(true)
        const result=await addCourseDetails(formData,token);
        if(result){
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
        console.log("form data :- ",formData);
        console.log("form data :- ",result);
    }

  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className='rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8 border-[1px]'
    >
        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5' htmlFor='courseTitle'>Course Title<sup className='text-pink-200'>*</sup></label>
            <input
                id='courseTitle'
                placeholder='enter Course title'
                {...register('courseTitle',{required:true})}
                className='w-full form-style'
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required</span>
                )
            }
        </div>

        <div className='flex flex-col space-y-2'>
            <label htmlFor='courseShortDesc' className='text-sm text-richblack-5'>Course Short Description<sup className='text-pink-200'>*</sup></label>
            <textarea 
             id='courseShortDesc'
             placeholder='enter Description'
             {...register("courseShortDesc",{required:true})}
             className='min-h-[140px] w-full form-style resize-x-none'
             />
            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Titlle is required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2 relative">
            <label className="text-sm text-richblack-5" htmlFor='coursePrice'>Course Price<sup className='text-pink-200'>*</sup></label>
            <input
                id='coursePrice'
                placeholder='enter Course title'
                {...register('coursePrice',
                {
                    required:true,
                    valueAsNumber:true,
                    pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    },
                }
                )}
                className='w-full form-style !pl-12'
            />
            <HiOutlineCurrencyRupee  className='absolute top-1/2 text-richblack-400 left-3 inline-block -translate-y-1/2 text-2xl'/>
            {
                errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor='courseCategory'>Course Category<sup className='text-pink-200'>*</sup></label>
            <select
            id='courseCategory'
            defaultValue=""
            {...register("courseCategory",{required:true})}
            className='form-style w-full'
            >
                <option value="" disabled>Choose a Category</option>
                {
                    !loading && courseCategories.map((category,index)=>(
                        <option key={index} value={category?._id} className='text-black'>
                            {category?.name}
                        </option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is Required</span>
                )
            }
        </div>

        {/* //create a custom component for handling tags input */}
            <ChipInput
                label="Tags"
                name="courseTags"
                placeholder="Enter tags and press enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValue={getValues}
            />

            {/* create a componnet for up[loading and showing preview of media */}
            <Upload
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
                editData={editCourse ? course?.thumbnail : null}
            />

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor='courseBenefits'>benefits of the course<sup className='text-pink-200'>*</sup></label>
                <textarea
                    id='courseBenefits'
                    placeholder='Enter Benefits of the course'
                    {...register("courseBenefits",{required:true})}
                    className='min-h-[130px] w-full form-style resize-x-none'
                />
                {
                    errors.courseBenefits && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Benefits of the course are required
                        </span>
                    )
                }
            </div>

            <RequirementField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                editData={editCourse ? course.instructions : []}
            />

        <div className='flex justify-end gap-x-2'>
            {
                editCourse && (
                    <button
                    onClick={()=>dispatch(setStep(2))}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue without Saving
                    </button>
                )
            }
            
            <IconButton
                text={!editCourse?"Next":"Save Changes"}
            />
        </div>


    </form>
  )
}

export default CourseInformationForm
