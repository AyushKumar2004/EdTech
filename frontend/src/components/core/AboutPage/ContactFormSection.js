import React from 'react'
import ContactUsForm from '../../ConatctPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto'>
      <h1 className='text-center text-4xl font-semibold'>
        Get In Touch
      </h1>
      <p className='text-center text-richblack-300 mt-3'>We'd love to be here for you,Please fill out this form.</p>
      <div className='mt-12 mx-auto'>
        <ContactUsForm/>
      </div>
    </div>
  )
}

export default ContactFormSection
