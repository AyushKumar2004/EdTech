import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import ReactPlayer from 'react-player'
import IconButton from '../../common/IconButton';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

const VideoDetails = () => {

    const {courseId,sectionId,subSectionId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const playRef=useRef();
    const location=useLocation();
    const {token}=useSelector((state)=>state.auth)
    const {courseSectionData,courseEntireData,completedLectures}=useSelector((state)=>state.viewCourse)

    const [videoData,setVideoData]=useState([]);
    const [videoEnded,setVideoEnded]=useState(false);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        const setVideoSpecificDetails=()=>{
            if(!courseSectionData.length){
                return;
            }
            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                //lets assume k all 3 fields are present

                const filteredData=courseSectionData.filter((course)=>course._id===sectionId);

                const filteredVideoData=filteredData?.[0]?.subSection.filter((data)=>data._id===subSectionId);
                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
        }
        setVideoSpecificDetails()
    },[courseSectionData,courseEntireData,location.pathname])

    const isFirstVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((data)=>data._id===sectionId)

        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((data)=>data._id===subSectionId);

        if(currentSectionIndex===0 && currentSubSectionIndex===0){
            return true;
        }else{
            return false;
        }
    }

    const isLastVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((data)=>data._id===sectionId)

        const noOfSubSection=courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((data)=>data._id===subSectionId);

        if(currentSectionIndex===courseSectionData.length-1 && currentSubSectionIndex===noOfSubSection-1){
            return true;
        }else{
            return false;
        }
    }

    const goToNextVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((data)=>data._id===sectionId)

        const noOfSubSection=courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((data)=>data._id===subSectionId);

        if(currentSubSectionIndex !== noOfSubSection-1){
            const nextSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSectionIndex+1]._id;
            //iss video me jao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);

        }else{
            const nextSectionId=courseSectionData[currentSectionIndex+1]._id;
            const nextSubSectionId=courseSectionData[currentSectionIndex+1].subSection[0]._id;
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((data)=>data._id===sectionId)

        const noOfSubSection=courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((data)=>data._id===subSectionId);

        if(currentSubSectionIndex!==0){
            const prevSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        }else{
            const prevSectionId=courseSectionData[currentSectionIndex-1]._id;
            const prevSubSectionLength=courseSectionData[currentSectionIndex-1].subSection.length;
            const prevSubSectionId=courseSectionData[currentSectionIndex-1].subSection[prevSubSectionLength-1]._id

            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion=async()=>{
        //dummy code
        setLoading(true);
        const res=await markLectureAsComplete({courseId:courseId,subSectionId:subSectionId},token);
        if(res){
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    }

  return (
    <div className='flex flex-col gap-5 text-white'>
      {
        !videoData
        ?(
        <div className='grid place-content-center'>
            No data Found
        </div>
        )
        :(
            <div className='relative'> 
                <MediaController
                style={{
                    width: "100%",
                    aspectRatio: "16/9",
                }}
                >
                <video
                    ref={playRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={()=>setVideoEnded(true)}
                    src={videoData?.videoUrl}
                    controls={false}
                    slot='media'
                    playing={false}
                >
                    {/* <BigPlayButton position="center" /> */}
                </video>
                <MediaControlBar>
                    <MediaPlayButton />
                    <MediaSeekBackwardButton seekOffset={10} />
                    <MediaSeekForwardButton seekOffset={10} />
                    <MediaTimeRange />
                    <MediaTimeDisplay showDuration />
                    <MediaMuteButton />
                    <MediaVolumeRange />
                    <MediaPlaybackRateButton />
                    <MediaFullscreenButton />
                </MediaControlBar>
                </MediaController>
                {
                        videoEnded && (
                            <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4 flex flex-col items-center'>
                                {
                                    !completedLectures.includes(subSectionId) && (
                                        <IconButton
                                            disabled={loading}
                                            onClick={()=>handleLectureCompletion()}
                                            text={!loading ?"Mark As Completed":"Loading..."}
                                        />
                                    )
                                }
                                <IconButton
                                    disabled={loading}
                                    onClick={()=>{
                                        if(playRef?.current){
                                            playRef.current.currentTime=0;
                                            setVideoEnded(false);
                                        }
                                    }}
                                    text="ReWatch"
                                    customClasses="text-xl"
                                />

                                <div className='flex gap-x-3'>
                                    {
                                        !isFirstVideo() && (
                                            <button
                                            disabled={loading}
                                            onClick={goToPrevVideo}
                                            className='blackButton'
                                            >
                                                Prev
                                            </button>
                                        )
                                    }
                                    {
                                        !isLastVideo() && (
                                            <button
                                            disabled={loading}
                                            onClick={goToNextVideo}
                                            className='blackButton'
                                            >
                                                Next
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
            </div>
        )
      }
      <h1 className='mt-4 text-3xl font-semibold'>
        {videoData?.title}
      </h1>
      <div className='pt-2 pb-6'>
        {videoData?.description}
      </div>
    </div>
  )
}

export default VideoDetails
