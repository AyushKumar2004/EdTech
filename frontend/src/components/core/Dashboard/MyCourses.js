import React, { useEffect, useState } from 'react'
import IconButton from '../../common/IconButton'
import { useNavigate } from 'react-router-dom'
import { VscAdd } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import CourseTable from './InstructorCourse/CourseTable'

const MyCourses = () => {

    const {token}=useSelector((state)=>state.auth);
    const [courses,setCourses]=useState();

    const navigate=useNavigate()

    useEffect(()=>{
        const fetchCourses=async()=>{
            const result=await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        };
        fetchCourses();
    },[])


  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Course</h1>
        <IconButton text="Add Course" onClick={()=>navigate("/dashboard/add-course")}><VscAdd/></IconButton>
      </div>
      {
        courses && <CourseTable courses={courses} setCourses={setCourses} />
      }
    </div>
  )
}

export default MyCourses
