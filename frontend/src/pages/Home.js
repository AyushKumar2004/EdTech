import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from "react-icons/fa"
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import ReviewSlider from '../components/common/ReviewSlider'

const Home = () => {
  return (
    <div>
      {/* Section:-1 */}
      <div className='relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center text-white justify-between'>
        
        <Link to={"/signup"}>
            <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-full shadow-[0_2px_0_0_rgba(255,255,255,0.18)] hover:shadow-none'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duation-200 group-hover:bg-richblack-900 '>
                    <p>Become an Instructor</p>
                    <FaArrowRight/>
                </div>
            </div>
        </Link>

        <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future with
            <HighlightText text={"Coding Skills"}/>
        </div>

        <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>

        <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
            <CTAButton active={false} linkto={"/login"}>Book A Demo</CTAButton>
        </div>


        <div className=' mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
            <video muted loop autoPlay className='shadow-[20.0px_20.0px_rgba(255,255,255)]'>
                <source src={Banner} type="video/mp4" />
            </video>
        </div>

        {/* code-section-1 */}
        <div>
            <CodeBlocks
                position={"lg:flex-row"}
                heading={
                    <div className='text-xl md:text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"Coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText:"Try it Yourself",
                        linkto:"/signup",
                        active:true
                    }
                }
                ctabtn2={
                    {
                        btnText:"Learn more",
                        linkto:"/login",
                        active:false
                    }
                }
                codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                codeColor={"text-yellow-25"}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
            />
        </div>

        {/* code-section-2 */}
        <div>
            <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"Coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText:"Try it Yourself",
                        linkto:"/signup",
                        active:true
                    }
                }
                ctabtn2={
                    {
                        btnText:"Learn more",
                        linkto:"/login",
                        active:false
                    }
                }
                codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                codeColor={"text-yellow-25"}
                backgroundGradient={<div className="codeblock2 absolute"></div>}
            />
        </div>
        
        <ExploreMore/>

      </div>

      {/* Section:-2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[320px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto'>
                    <div className='sm:h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white lg:mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-2'>
                                Explore full Catelog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='mx-auto gap-8 w-11/12 max-w-maxContent flex flex-col items-center justify-between'>
                <div className='flex flex-col gap-5 mb-10 mt-[-100px] justify-between hap-7 lg:mt-20 lg:flex-row lg:gap-0'>
                    <div className='text-4xl font-semibold lg:w-[45%]'>
                        Get the skills you need for a 
                        <HighlightText text={"Job That is in Demand"}/>
                    </div>
                    <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
                        <p className='text-[16px]'>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>
                        <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                    </div>
                </div>  

                <TimelineSection/>

                <LearningLanguageSection/>
            </div>         
      </div>

      {/* Section:-3 */}
      <div className='w-11/12 relative my-20 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 first-letter text-white'>
            <InstructorSection/>
            <h2 className='text-4xl text-center font-semibold mt-8'>Review from Others learners</h2>
            {/* review Slider */}
            <ReviewSlider/>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default Home
