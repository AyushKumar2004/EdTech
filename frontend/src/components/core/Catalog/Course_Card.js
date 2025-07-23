import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStar from '../../common/RatingStar'
import GetAvgRating from '../../../utils/AvgRatings';

const Course_Card = ({course,Height}) => {


    const [avgReviewCount,setAvgRatingCount]=useState(0);

    useEffect(()=>{
        const count=GetAvgRating(course?.ratingAndReviews);
        setAvgRatingCount(count);
    },[course])

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div>
            <div className='rounded-lg'>
                <img
                    src={course?.thumbnail}
                    alt='Course ka thumbnail'
                    className={`${Height} w-full rounded-2xl object-cover aspect-auto`}
                />
            </div>
            <div className='flex flex-col gap-2 px-1 py-3'>
                <p className='text-lg text-richblack-5'>{course?.courseName}</p>
                <p className='text-sm text-richblack-50'>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                <div className='flex items-center gap-2'>
                    <span className='text-yellow-5'>{avgReviewCount || 0}</span>
                    <RatingStar Review_Count={avgReviewCount} />
                    <span className='text-richblack-400'>{course?.ratingAndReviews?.length} Ratings</span>
                </div>
                <p className='text-xl text-richblack-5'>{course?.price}</p>
            </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card
