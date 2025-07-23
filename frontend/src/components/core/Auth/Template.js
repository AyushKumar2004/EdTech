import React from 'react'
import frameImg from "../../../assets/Images/frame.png"
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

const Template = ({title,description1,description2,formType,image}) => {
  return (
    <div className=''>
      <div className='flex items-center h-[90%]  md:flex-row md:gap-y-0 md:gap-x-12 mx-auto w-11/12 justify-between flex-col-reverse gap-y-12 max-w-maxContent py-12'>
        <div className='mx-auto w-11/12 max-w-[450px] md:mx-0'>
            <h1 className='text-richblack-5 leading-[2.375rem] text-[1.875rem] font-semibold '>
                {title}
            </h1>
            <p className='mt-3 text-[1.125rem] leading-[1.625rem]'>
                <span className='text-richblack-200'>{description1}</span>{""}
                <span className='font-edu-sa font-bold italic text-blue-100'>{description2}</span>
            </p>
            {formType==="signup"?(<SignupForm/>):(<LoginForm/>)}
        </div>
        <div className='relative mx-auto w-11/12 max-w-[450px] md:mx-0'>
             <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
        </div>
      </div>
    </div>
  )
}

export default Template
