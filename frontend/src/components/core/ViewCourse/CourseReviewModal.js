import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import IconButton from '../../common/IconButton';
import { createRating } from '../../../services/operations/courseDetailsAPI';
//import ReactStars from "react-rating-stars-component"
import { Rating } from 'react-simple-star-rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RxCross2 } from 'react-icons/rx';

const CourseReviewModal = ({setReviewModal}) => {

    const {user}=useSelector((state)=>state.profile);
    const {token}=useSelector((state)=>state.auth);
    const {courseEntireData}=useSelector((state)=>state.viewCourse)

    const {register,
        handleSubmit,
        setValue,
        formState:{errors},
    }=useForm();

    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating",0);
    },[])

    const onSubmit=async(data)=>{
        await createRating({
            courseId:courseEntireData?._id,
            rating:data.courseRating,
            review:data.courseExperience
        },token)
        setReviewModal(false);
    }

    const ratingChanged=(newRating)=>{
        const scaledRating = newRating  
        setValue("courseRating",scaledRating)
    }


  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                <button
                onClick={()=>setReviewModal(false)}
                >
                    <RxCross2 className='text-2xl text-richblack-5'/>
                </button>
            </div>

                <div className='p-6'>
                    <div className='flex items-center justify-center text-richblack-5 gap-x-3'>
                        <img
                            src={user?.image}
                            alt='user image'
                            className='aspect-square w-[50px] rounded-full object-cover'
                        />
                        <div>
                            <p className='font-semibold text-richblack-5'>{user?.firstName} {user?.lastName}</p>
                            <p className='text-sm text-richblack-5'>Posting Public</p>
                        </div>
                    </div>
                    <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=' flex items-center flex-col mt-6'
                    >
                        <div className=''>
                            <div
                                style={{
                                    direction: 'ltr',
                                    fontFamily: 'sans-serif',
                                    touchAction: 'none',
                                    display:'inline'
                                }}
                                >
                                <Rating
                                    onClick={ratingChanged}
                                    size={24}
                                    allowFraction={false}
                                    initialValue={0}
                                    SVGstyle={{ display: 'inline' }}
                                    fillColor="#ffd700"
                                    className="mt-2"
                                />
                                </div>
                        </div>
                        <div className='flex w-11/12 flex-col space-y-2'>
                            <label htmlFor='courseExperience' className='text-sm text-richblack-5'>Add Your Experience</label>
                            <textarea
                                id='courseExperience'
                                placeholder='Add Your Experience here'
                                {...register("courseExperience",{required:true})}
                                className=' min-h[130px] w-full form-style resize-x-none'
                            />
                            {
                                errors.courseExperience && (
                                    <span className='ml-2  text-xs tracking-wide text-pink-200'>Please add your experience</span>
                                )
                            }
                        </div>

                        <div className='mt-6 flex w-11/12 justify-end gap-x-2'>
                            <button
                            onClick={()=>setReviewModal(false)}
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                            >
                                Cancel
                            </button>
                            <IconButton
                                text="save"
                            />
                        </div>
                    </form>
                </div>
        
            </div>
    </div>
    
  )
}

export default CourseReviewModal
