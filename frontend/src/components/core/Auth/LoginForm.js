import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"
import { login } from '../../../services/operations/authAPI';

const LoginForm = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();

  const [formData,setFormData]=useState(
    {
      email:"",
      password:"",
    }
  );

  const {email,password}=formData;

  const [showPassword,setShowPassword]=useState(false);

  const handleOnChange=(e)=>{
    setFormData((prevData)=>({
      ...prevData,
      [e.target.name]:e.target.value,
    }))
  }

  const handleOnSubmit=(e)=>{
    e.preventDefault();
    dispatch(login(email,password,navigate));
  }

  return (
    <div className=''>
      <form onSubmit={handleOnSubmit} className='w-full flex flex-col gap-y-4 mt-6'>
        <label className='w-full'>
          <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
            EmailAddress <span className='text-pink-200'>*</span>
          </p>
          <input
          type='text'
          name="email"
          id="email"
          value={email}
          onChange={handleOnChange}
          placeholder='Enter your email'
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
          />
        </label>
        <label className='w-full relative'>
          <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
            Enter Password <span className='text-pink-200'>*</span>
          </p>
          <input
          type={showPassword?"text":"password"}
          name="password"
          id="password"
          value={password}
          onChange={handleOnChange}
          placeholder='Enter Password'
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
          />
          <span onClick={()=>setShowPassword((prev)=>!prev)} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
            {showPassword?(<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>):(<AiOutlineEye fontSize={24} fill="#AFB2BF"/>)}
          </span>
          <Link to={"/forgot-password"}>
            <p className='mt-1 ml-auto max-w-max text-xs text-blue-100'>
              forgot password
            </p>
          </Link>
        </label>
        <button className='w-full rounded-[8px] bg-yellow-50 text-center font-medium py-[8px] px-[12px] text-richblack-900'>
          Sign In
        </button>
      </form>
    </div>
  )
}

export default LoginForm
