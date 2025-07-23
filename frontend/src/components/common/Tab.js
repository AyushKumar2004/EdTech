import React from 'react'

const Tab = ({tabData,field,setField}) => {
  return (
    <div>
      <div style={{
          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }} className='flex flex-row gap-x-1 bg-richblack-800 p-1 my-6 rounded-full max-w-max'>

        {
            tabData.map((tab)=>{
                return (
                    <button onClick={()=>setField(tab.type)} key={tab.id} className={`${tab.type===field?"bg-richblack-900 text-richblack-5":"bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}>
                        {tab?.tabName}
                    </button>
                )
            })
        }

      </div>
    </div>
  )
}

export default Tab
