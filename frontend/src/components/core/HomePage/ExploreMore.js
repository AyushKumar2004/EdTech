import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabName=[
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];



const ExploreMore = () => {

    const [currentTab,setCurrentTab]=useState(tabName[0]);
    const [courses,setCourses]=useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading);

    const setMyCards=(value)=>{
        setCurrentTab(value);
        const result=HomePageExplore.filter((course)=> course.tag===value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div>
      <div className='text-xl md:text-4xl font-semibold text-center'>
        Unlock the 
        <HighlightText text={"Power of Code"}/>
      </div>
      <p className='text-center text-richblack-300 text-sm text-[16px]  mt-3'>Learn to build anything you imagine</p>

      <div className='flex flex-row rounded-full bg-richblack-800 mt-5 mb-5 sm:px-2 sm:py-2 xs:px-0 xs:py-0 border-richblack-100'>
        {
            tabName.map((element,index)=>{
                return (
                    <div className={`sm:text-[16px] xs:text-[8px] flex flex-row items-center gap-2 ${currentTab===element?"bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200"} rounded-full duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`} key={index}
                    onClick={()=>setMyCards(element)}>
                        {element}
                    </div>
                )
            })
        }
      </div>

      <div className='lg:h-[150px]'></div>
    
      {/* course card group */}
      <div className='absolute lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] flex flex-row gap-10 justify-between w-full '>
        {
            courses.map((element,index)=>{
                return (
                    <CourseCard
                    key={index}
                    cardData={element}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard}
                    />
                )
            })
        }
      </div>

    </div>
  )
}

export default ExploreMore
