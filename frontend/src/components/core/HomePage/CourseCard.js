import React from 'react'
import { HiUsers } from "react-icons/hi2";
import { ImTree } from "react-icons/im";


const CourseCard = ({cardData,currentCard,setCurrentCard}) => {
  return (
    <div onClick={()=>setCurrentCard(cardData.heading)} className={`w-[360px] lg:w-[30%] h-[300px] xs:hidden sm:block  ${currentCard===cardData.heading?"bg-white shadow-[12px_12px_0_0] shadow-yellow-50":"bg-richblack-800"}`}>
      <div className='flex flex-col p-2  sm:p-6  gap-3 mb-12'>
        <h2 className={`text-xl font-semibold mb-3 ${currentCard===cardData.heading?"text-black ":"text-white"}`}>{cardData.heading}</h2>
        <p className={`text-medium text-richblack-400`}>{cardData.description}</p>
      </div>
      <div className={`flex flex-row items-center ${currentCard===cardData.heading?"text-blue-200":"text-richblack-400"} justify-between py-2 px-7 border-dashed border-t-2 border-richblack-200 `} >
            <div className='flex flex-row gap-3 items-center '>
                <HiUsers />
                <p className={`text-medium  font-semibold`}>{cardData.level}</p>
            </div>
            <div className='flex flex-row gap-3 items-center'>
                <ImTree/>
                <p className={`text-medium  font-semibold`}>{cardData.lessionNumber} Lessons</p>
            </div>
        </div>
    </div>
  )
}

export default CourseCard
