import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {

    const {user,loading:profileLoading}=useSelector((state)=>state.profile);
    const {loading:authLoading}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [confirmationModal,setConfirmationModal]=useState(null)

    if(profileLoading || authLoading){
        return (
            <div className='spinner flex items-center justify-center'>Loading...</div>
        )
    }

  return (
    <>
      <div className='xs:hidden sm:flex min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 h-[clac(100vh-3.5rem)] bg-richblack-800 py-10 text-richblack-300'>
        <div className='flex flex-col'>
            {
                sidebarLinks.map((link,index)=>{
                    if(link.type && user?.accountType!==link.type) return null;
                    return (
                        <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                    )
                })
            }
        </div>
        <div className='max-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>
        <div className='flex flex-col'>
            <SidebarLink link={{name:"Settings",path:"/dashboard/settings"}} iconName="VscSettingsGear" />
            <button onClick={()=>setConfirmationModal(
                {
                text1:"Are Tou sure?",
                text2:"You will be Logged out of Your account",
                btn1Text:"Logout",
                btn2Text:"Cancel",
                btn1Handler:()=>dispatch(logout(navigate)),
                btn2Handler:()=>setConfirmationModal(null)
                }
            )}
            className='px-8 py-2 text-sm font-medium text-richblack-300'>
                <div className='flex items-center gap-x-2'>
                    <VscSignOut className='text-lg'/>
                    <span>Logout</span>
                </div>
            </button>
        </div>
      </div>

      <div className='sm:hidden xs:gap-9 sm:gap-0 absolute bottom-0 flex border-t-[1px] border-t-richblack-700 h-[clac(0.2rem)] w-full bg-richblack-800 py-2 text-richblack-300'>
            <div className='flex xs:gap-7 sm:gap-0'>
                {
                    sidebarLinks.map((link,index)=>{
                        if(link.type && user?.accountType!==link.type) return null;
                        return (
                            <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                        )
                    })
                }
            </div>
        
        <div className='flex sm:flex-col xs:gap-7 sm:gap-0'>
            <SidebarLink link={{name:"Settings",path:"/dashboard/settings"}} iconName="VscSettingsGear" />
            <button onClick={()=>setConfirmationModal(
                {
                text1:"Are Tou sure?",
                text2:"You will be Logged out of Your account",
                btn1Text:"Logout",
                btn2Text:"Cancel",
                btn1Handler:()=>dispatch(logout(navigate)),
                btn2Handler:()=>setConfirmationModal(null)
                }
            )}
            className='sm:px-8 sm:py-2 px-4 py-1 text-sm font-medium text-richblack-300'>
                <div className='flex items-center gap-x-2'>
                    <VscSignOut className='text-lg'/>
                    <span className='xs:hidden flex'>Logout</span>
                </div>
            </button>
        </div>
      </div>
      {
        confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
      }
    </>
  )
}

export default Sidebar
