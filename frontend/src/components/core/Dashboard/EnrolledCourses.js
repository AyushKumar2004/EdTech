import React, { useEffect, useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {

    const {token}=useSelector((state)=>state.auth);

    const [enrolledCourses,setEnrolledCourses]=useState(null);
    const navigate=useNavigate()

    const getEnrolledCourses=async()=>{
        try {
            const response=await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch (error) {
            console.log(error)
            console.log("unable to fetch Enrolled Courses")
        }
    }

    console.log("this is enrolled courses.....",enrolledCourses)

    useEffect(()=>{
        getEnrolledCourses();
    },[])

  return (
    <div>
      <div className='text-3xl text-richblack-50'>Enrolled Courses</div>
      {
        !enrolledCourses ?(<div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
            <div className='spinner'>
                Loading
            </div>
        </div>
        )
        :(!enrolledCourses.length?(
            <p className='grid h-[10vh] w-full place-content-center text-richblack-5'>You have not enrolled in any Course yet</p>)
        :(
            <div className='my-8 text-richblack-5'>
                <div className='flex rounded-t-lg bg-richblack-500'>
                    <p className='w-[45%] px-5 py-3'>Course Name</p>
                    <p className='w-1/4 px-2 py-3'>Durations</p>
                    <p className='flex-1 px-2 py-3'>Progress</p>
                </div>
                {/* Cards shure hote hai ab */}
                {
                    enrolledCourses.map((course,index,arr)=>(
                        <div
                        className={`flex items-center border border-richblack-700 ${
                            index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                        }`}
                        key={index}
                        >
                            <div
                            className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                            onClick={() => {
                            navigate(
                                `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                            )
                            }}
                            >
                                <img src={course.thumbnail}
                                alt='course_img'
                                className='h-14 w-14 rounded-lg objetc-cover'
                                 />
                                <div className='flex max-x-xs flex-col gap-2'>
                                    <p className='fonr-semibold '>{course.courseName}</p>
                                    <p className='text-xs text-richblack-300'>{course.courseDescription}</p>
                                </div>
                            </div>

                            <div className='w-1/4 px-2 py-3'>
                                {course?.totalDuration}
                            </div>

                            <div className='flex w-1/5 flex-col gap-2 px-2 py-3'>
                                <p>Progress:{course.progressPercentage || 0}%</p>
                                <ProgressBar
                                completed={course.progressPercentage || 0}
                                height='8px'
                                isLabelVisible={false}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        ))
      }
    </div>
  )
}

export default EnrolledCourses
