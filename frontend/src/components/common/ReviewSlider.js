import React, { useEffect, useState } from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode,Pagination,Autoplay, Navigation} from "swiper/modules"
import { Rating } from 'react-simple-star-rating'
import { apiConnector } from '../../services/apiconnector'
import { ratingsEndpoints } from '../../services/apis'

const ReviewSlider = () => {

    const [reviews,setReviews]=useState([]);
    const truncateWords=15;


    useEffect(()=>{
        const fetchAllReviews=async()=>{
            const {data}=await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API);
            console.log("respinse",data)

            if(data?.success){
                setReviews(data?.data);
            }

            console.log("PRINTING REVIEWS",reviews)
        }
        fetchAllReviews();
    },[])

  return (
    <div className='text-white w-full'>
      <div className='h-[190px] my-[50px] lg:max-w-maxContent max-w-maxContentTab sm:flex xs:hidden'>
        <Swiper
        slidesPerView={4}
        spaceBetween={24}
        loop={true}
        freeMode={true}
        autoplay={{
            delay:2500
        }}
        modules={[FreeMode,Pagination,Autoplay]}
        className='w-full'
        >
            
            {
                reviews.map((review,index)=>(
                    <SwiperSlide key={index}>
                        <div className='flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 w-full'>
                            <div className='flex items-center gap-4'>
                                <img
                                    src={review?.user?.image
                                    ? review?.user?.image 
                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                                    alt='profile-pic'
                                    className='h-9 w-9 object-cover rounded-full'
                                />
                                <div className='flex flex-col'>
                                    <p className='font-semibold text-richblack-5'>{review?.user?.firstName} {review?.user?.lastName}</p>
                                    <p className='text-[12px] font-medium text-richblack-500'>{review?.course?.courseName}</p>
                                </div>
                            </div>
                            <p className="font-medium text-richblack-25">
                                {review?.review.split(" ").length > truncateWords
                                ? `${review?.review
                                    .split(" ")
                                    .slice(0, truncateWords)
                                    .join(" ")} ...`
                                : `${review?.review}`}
                            </p>
                            <div className='flex items-center gap-2'>
                                <Rating
                                    readonly
                                    initialValue={review?.rating}
                                    SVGstyle={{ display: 'inline' }}
                                />
                                <p className='font-semibold text-yellow-100'>{review?.rating}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }

        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
