import React from 'react'
import Footer from '../components/common/Footer'
import ContactForm from '../components/ConatctPage/ContactForm'
import ContactDetails from '../components/ConatctPage/ContactDetails'
import ReviewSlider from '../components/common/ReviewSlider'

const Contact = () => {
  return (
    <div>
      <div className='flex flex-col lg:flex-row w-11/12 max-w-maxContent mx-auto mt-20 jutify-between gap-10 text-white'>
        <div className='lg:w-[40%]'>
            <ContactDetails/>
        </div>
        <div className='lg:w-[60%]'>
            <ContactForm/>
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* <ReviewSlider /> */}
        <ReviewSlider/>
      </div>
      <Footer/>
    </div>
  )
}

export default Contact
