import React, { useState } from 'react'
import Tab from '../../common/Tab';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import {toast} from "react-hot-toast"
import { setSignupData } from '../../../slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOTP } from '../../../services/operations/authAPI';
import { ACCOUNT_TYPE } from '../../../utils/constants';

const SignupForm = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [accountType,setAccountType]=useState(ACCOUNT_TYPE.STUDENT);
    // data to pass to Tab component
    const tabData = [
        {
        id: 1,
        tabName: "Student",
        type: ACCOUNT_TYPE.STUDENT,
        },
        {
        id: 2,
        tabName: "Instructor",
        type: ACCOUNT_TYPE.INSTRUCTOR,
        },
    ]

    const [formData,setFormData]=useState(
      {
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
      }
    )

    const {firstName,lastName,email,password,confirmPassword}=formData;

    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);

    const handleOnChange=(e)=>{
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value
        }));
    }

  const handleOnSubmit=(e)=>{
    e.preventDefault();

    if(password!==confirmPassword){
      toast.warning("Password does not match");
      return;
    }

    const signupData={
      ...formData,
      accountType,
    }

    dispatch(setSignupData(signupData));

    dispatch(sendOTP(formData.email,navigate));

    setFormData({
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      confirmPassword:""
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }


  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType}/>

      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className='flex gap-x-4'>
            <label>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                First Name <sup className='text-pink-200'>*</sup>
                </p>
                <input 
                type='text' 
                name='firstName' 
                id='firstName' 
                value={firstName} 
                onChange={handleOnChange} 
                placeholder='Enter your firstName' 
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5' 
                required
                />
            </label>
            <label>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Last Name <sup className='text-pink-200'>*</sup>
                </p>
                <input 
                type='text' 
                name='lastName' 
                id='lastName' 
                value={lastName} 
                onChange={handleOnChange} 
                placeholder='Enter your lastName' 
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5' 
                required
                />
                
            </label>
        </div>
        <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Email Address <sup className='text-pink-200'>*</sup>
            </p>
            <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>
        <div className='flex gap-x-4'>
            <label className='relative'>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Create Password <sup className='text-pink-200'>*</sup>
                </p>
                <input 
                type={showPassword?'text':'password'} 
                name='password' 
                id='password' 
                value={password} 
                onChange={handleOnChange} 
                placeholder='Enter Password' 
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5' 
                required
                />
                <span onClick={()=>{setShowPassword(!showPassword)}} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
                  {
                    showPassword?(<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>):(<AiOutlineEye fontSize={24} fill="#AFB2BF"/>)
                  }
                </span>
            </label>
            <label className='relative'>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm Password <sup className='text-pink-200'>*</sup>
                </p>
                <input 
                type={showConfirmPassword?"text":"password"}
                name='confirmPassword' 
                id='confirmPassword' 
                value={confirmPassword} 
                onChange={handleOnChange} 
                placeholder='Enter password' 
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5' 
                required
                />
                <span onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
                  {
                    showConfirmPassword?(<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>):(<AiOutlineEye fontSize={24} fill="#AFB2BF"/>)
                  }
                </span>
            </label>
        </div>
        <div>
          <button type='submit' className=' mt-6 w-full bg-yellow-50 font-medium text-richblack-900 text-center py-[8px] px-[12px] rounded-[8px]'>Create Account</button>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
