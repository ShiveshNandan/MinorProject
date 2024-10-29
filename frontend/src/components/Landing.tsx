"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Room from "@/app/Room/page"

const Page = () => {
  const [name, setname] = useState("")
  const [joined, setjoined] = useState(false)
  const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null)
  const [localAudioTrack, setlocalAudioTrack] = useState<MediaStreamTrack | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null);

  const getCam = async() => {
    const streams =await window.navigator.mediaDevices.getUserMedia({
      video : true,
      audio : true,
    });
    const audioTrack = streams.getAudioTracks()[0]
    const videoTrack = streams.getVideoTracks()[0]
    setlocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    if(!videoRef){
      return
    }
    videoRef.current!.srcObject = new MediaStream([videoTrack]);
    // videoRef.current!.play();
  }

  useEffect(() => {
    if(videoRef && videoRef.current){
      getCam()
    }
  }, [videoRef])


  // return (
  //   <div>
  //     Room
  //     <video autoPlay ref={videoRef} src=""></video>
  //     <input type="text" onChange={(e) => setname(e.target.value)} />
  //     <Link href={`Room/?name=${name}`}>
  //     <button className=''>Join</button>
  //     </Link>
  //   </div>
  // )

  if(!joined){
    return (
      <div>
        Room
        <video autoPlay ref={videoRef} src=""></video>
        {/* <video autoPlay ref={videoRef} src=""></video> */}
        <input type="text" onChange={(e) => setname(e.target.value)} />
        {/* <Link href={`Room/?name=${name}`}> */}
        <button onClick = {() => setjoined(true)}  className=''>Join</button>
        {/* </Link> */}
      </div>
    )
  }else{
    return(
      <>
        <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack}/>
      </>
    )
  }

}

export default Page
