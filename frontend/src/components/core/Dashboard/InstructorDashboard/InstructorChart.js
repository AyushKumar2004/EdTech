import React, { useState } from 'react'
import { Chart ,registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables)

const InstructorChart = ({courses}) => {

    const [currChart,setCurrChart]=useState("students");

    const getRandomColors=(numColors)=>{
        const colors=[];
        for(let i=0;i<numColors;i++){
            const color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${
            Math.floor(Math.random()*256)})`
            colors.push(color)
        }
        return colors;
    }

    //create data for chart diplaying students info
    const chartDataForStudent={
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalStudentsEnrolled),
                backgroundColor:getRandomColors(courses.length),
            }
        ]
    }

    //create data for chart displaying income info
    const chartDataForIncome={
        labels:courses.map((course)=>course.courseName),
        datasets:[
            {
                data:courses.map((course)=>course.totalAmountGenerated),
                backgroundColor:getRandomColors(courses.length),
            }
        ]
    }

    //create options
    const options={
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: `${currChart.toUpperCase()} `
        }
        }
    }

  return (
    <div className='flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 max-w-[75%]'>
      <p className='text-lg font-bold text-richblack-5'>Visualize</p>
      <div className='space-x-4 font-semibold'>
        <button
        onClick={()=>setCurrChart("students")}
        className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
            student
        </button>
        <button
        onClick={()=>setCurrChart("income")}
        className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
            Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-[80%] w-full">
        <Pie
            data={currChart==="students"?chartDataForStudent:chartDataForIncome}
            options={options}
        />
      </div>
    </div>
  )
}

export default InstructorChart
