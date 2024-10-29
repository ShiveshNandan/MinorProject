"use client"
import React, { useEffect, useState } from 'react'
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

const Page = ({name,localAudioTrack,localVideoTrack}:{name:any,localAudioTrack:any,localVideoTrack:any}) => {
  // const [name, setname] = useState("")
  const [socket, setsocket] = useState<null | Socket>(null);
  const [lobby, setlobby] = useState(true);
  // const [connected, setconnected] = useState(false);

  useEffect(() => {
    const socket = io(URL)
    
    socket.on("send-offer", ({roomId}) => {
      alert("send offer please");
      setlobby(false);
      console.log("send-offer room id: ",roomId);
      socket.emit("offer", {
        roomId,
        sdp: ""
      })
    });

    socket.on("offer", ({roomId, offer}) => {
      alert("accept answer please!");
      console.log("offer room id: ",roomId);
      setlobby(false);
      // socket.emit("answer", {
      //   roomId,
      //   sdp: ""
      // })
    });

    socket.on("answer", ({roomId, answer}) => {
      setlobby(false);
      alert("connected")
      // console.log("connected id: ",roomId);
    });

    socket.on("lobby",() =>{
      setlobby(true);
    })

    setsocket(socket)
  }, [])
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const naming = urlParams.get("name")
      // setname(naming!);
    }
    
  }, [])
  const [first, setfirst] = useState(0)


  if(lobby) {
    return <div>
      waiting to connect you with someone !!
    </div>
  }
  let h = first;
  const changefirst = () => {
    h = h+1;
    setfirst(h);
  }


  return (
    <div>
      {`hi, ${name}`}
      <p onClick={()=>{changefirst()}}>{`${first}`}</p>
      <video height={400} width={400}></video>
      <video height={400} width={400}></video>
    </div>
  )
}

export default Page
