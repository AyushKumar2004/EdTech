import React, { useEffect, useState } from 'react'
import {useForm} from "react-hook-form"
import { setLoading } from '../../slices/authSlice';
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/apis';
import CountryCode from '../../data/countrycode.json'

const ContactUsForm = () => {

    const [loading,setloading]=useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful}
    }=useForm();

    const submitContactForm=async(data)=>{
        console.log("Logging data",data);
        try{
            setLoading(true);
            console.log(data)
            const response=await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
            //console.log("logging-response",response);
            setLoading(false);
        }catch(e){
            console.log("Errorm message",e.message);
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:"",
            })
        }
    },[isSubmitSuccessful,reset])
  return (
    <div className=''>
      <form className='flex flex-col gap-7' onSubmit={handleSubmit(submitContactForm)}>
      
        <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='firstName' className="lable-style">First Name</label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="enter first name"
                    {...register("firstName",{required:true})}
                    className='form-style'
                />
                {
                    errors.firstName && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your Name</span>
                    )
                }
            </div>
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastName' className="lable-style">First Name</label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="enter last name"
                    {...register("lastName")}
                    className='form-style'
                />
                {
                    errors.firstName && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your Name</span>
                    )
                }
            </div>
        </div>
         <div className='flex flex-col'>
                <label htmlFor='email' className="lable-style">Email Address</label>
                <input 
                    type='email'
                    name="email"
                    id="email"
                    palceholfder="enter your email Address"
                    {...register("email",{required:true})}
                    className='form-style'
                />
                {
                    errors.email && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your email</span>
                    )
                }
        </div>

        <div className='flex flex-col '>
                <label htmlFor='phonenumber' className="lable-style">Phone Number</label>
                <div className='flex flex-row gap-5 '>
                {/* dropdown */}
                    <div className='flex w-[81px] flex-col gap-2'>
                        <select
                        name='dropdown'
                        id='dropdown'
                        {...register('countrycode',{required:true})}
                        className='form-style'
                        >
                            {
                                CountryCode.map((element,index)=>{
                                    return (
                                        <option key={index} value={element.code}>
                                            {element.code}-{element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
                        <input
                        type='number'
                        name='phonenumber'
                        id='phonenumber'
                        placeholder='12345 67890'
                        className='form-style [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        {...register('phoneNo',
                        {
                            required:{value:true,message:"please enter Phone Number"},
                            maxLength:{value:10,message:"Invalid Phone Number"},
                            minLength:{value:8,message:"Invalid Phone Number"}
                        })}
                        ></input>
                    </div>
                </div>
                {
                    errors.phoneNo&&(
                        <span className='-mt-1 text-[12px] text-yellow-100'>
                            {errors.phoneNo.message}
                        </span>
                    )
                }
        </div>

        <div className=' flex flex-col'>
                <label htmlFor='message' className="lable-style">Message</label>
                <textarea
                name="message"
                id="message"
                cols="30"
                rows="7"
                placeholder="Enter Your message here"
                {...register("message",{required:true})}
                className='form-style'
                ></textarea>
                {
                    errors.message && (
                        <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your message</span>
                    )
                }
        </div>
            <button disabled={loading} type="submit" className={`rounded-md bg-yellow-50 text-center px-6 py-3 text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18) ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}>
                Send Message
            </button>
      </form>
    </div>
  )
}

export default ContactUsForm
