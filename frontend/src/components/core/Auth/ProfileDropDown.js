import React, { useRef, useState } from 'react'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { logout } from '../../../services/operations/authAPI';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

const ProfileDropDown = () => {

  const {user}=useSelector((state)=>state.profile);
  const [open,setOpen]=useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate();

  const ref=useRef(null);

  useOnClickOutside(ref,()=>setOpen(false));

  if(!user) return null

  return (
    <div>
      <button className='relative' onClick={()=>setOpen(true)}>
        <div className='flex items-center gap-x-1'>
          <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className='aspect-square w-[30px] rounded-full object-cover'
          />
          <AiOutlineCaretDown className='text-sm text-richblack-100'/>
        </div>
        {
          open && (
            <div 
            className='absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 '
            ref={ref}
             onClick={(e)=>e.stopPropagation()}>
              <Link to={"/dashboard/my-profile"} onClick={()=>setOpen(false)}>
              <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm bg-richblack-900 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                  <VscDashboard className='text-lg'/>
                  Dashboard
              </div>
              </Link>
              <div
              className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm bg-richblack-900 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
              onClick={()=>{
                dispatch(logout(navigate));
                setOpen(false)
              }}>
                <VscSignOut className='text-lg'/>
                Logout
              </div>
            </div>
          )
        }
      </button>
    </div>
  )
}

export default ProfileDropDown
