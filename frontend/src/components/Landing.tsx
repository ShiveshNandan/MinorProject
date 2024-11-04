"use client";
import React, { useEffect, useRef, useState } from "react";
import Room from "./Room";
import Navbar from "./navbar";
import { useTheme } from "next-themes";

const Page = () => {
  const [name, setname] = useState("");
  const [joined, setjoined] = useState(false);
  const [localVideoTrack, setlocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localAudioTrack, setlocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getCam = async () => {
    const streams = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const audioTrack = streams.getAudioTracks()[0];
    const videoTrack = streams.getVideoTracks()[0];
    setlocalAudioTrack(audioTrack);
    setlocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }
    videoRef.current!.srcObject = new MediaStream([videoTrack]);
    videoRef.current!.play();
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
  }, [videoRef]);

  const { theme } = useTheme();

  if (!joined) {
    return (
      <div>
        <Navbar />
        <div className="pt-28 flex max-md:flex-col-reverse w-10/12 m-auto my-auto flex-start max-sm:w-11/12 max-md:pt-7 min-md:h-screen">
          <div className="w-5/12 max-md:w-full m-auto flex flex-col max-md:mb-10 max-sm:mt-[-10vw] max-sm:flex-col-reverse">
          <div className="">
            <p className="text-center text-4xl font-semibold max-sm:text-2xl">
              Meet for Mute: Bridging Communication Gaps
            </p>
            <p className={`${theme == "dark" ? "text-gray-300" : "text-gray-700"} text-center text-sm py-7 max-sm:text-xs`}>
              Empowering seamless conversations for everyone, with real-time
              sign language interpretation and easy accessibility for those who
              communicate differently.
            </p>
            </div>
            <div className="flex justify-center m-1 max-sm:border-b-2 pb-8 mb-5 my-auto max-sm:mt-16">
              <input type="text" className="bg-blue-200 mx-2 p-1 rounded px-3 w-[300px]" onChange={(e) => setname(e.target.value)} />
              <button onClick={() => setjoined(true)} className="bg-blue-500 px-4 rounded py-1">
                Join
              </button>
            {/* </div> */}
            </div>
          </div>
          <video className="m-auto max-sm:h-auto h-[350px] rounded-md max-md:mb-10 max-sm:m-auto my-auto max-md:pt-16" autoPlay ref={videoRef} src=""></video>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Room
          name={name}
          localAudioTrack={localAudioTrack}
          localVideoTrack={localVideoTrack}
        />
      </>
    );
  }
};

export default Page;
