"use client"
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

const Room = ({
  name,
  localAudioTrack,
  localVideoTrack
}: {
  name: string,
  localAudioTrack: MediaStreamTrack | null,
  localVideoTrack: MediaStreamTrack | null,
}) => {
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement>();
  const remoteVideoRef = useRef<any>();
  // const localVideoRef = useRef<HTMLVideoElement>();
  const localVideoRef = useRef<any>();

  useEffect(() => {
      const socket = io(URL);
      socket.on('send-offer', async ({roomId}) => {
          console.log("sending offer");
          setLobby(false);
          const pc = new RTCPeerConnection();
          setSendingPc(pc);
          if (localVideoTrack) {
              pc.addTrack(localVideoTrack)
          }
          if (localAudioTrack) {
              pc.addTrack(localAudioTrack)
          }

          pc.onicecandidate = async (e) => {
              console.log("receiving ice candidate locally");
              if (e.candidate) {
                 socket.emit("add-ice-candidate", {
                  candidate: e.candidate,
                  type: "sender"
                 })
              }
          }

          pc.onnegotiationneeded = async () => {
              console.log("on negotiation neeeded, sending offer");
              const sdp = await pc.createOffer();
              //@ts-ignore
              pc.setLocalDescription(sdp)
              socket.emit("offer", {
                  sdp,
                  roomId
              })
          }
      });

      socket.on("offer", async ({roomId, sdp: remoteSdp}) => {
          console.log("received offer");
          setLobby(false);
          const pc = new RTCPeerConnection();
          pc.setRemoteDescription(remoteSdp)
          const sdp = await pc.createAnswer();
          //@ts-ignore
          pc.setLocalDescription(sdp)
          const stream = new MediaStream();
          if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
          }
          setRemoteMediaStream(stream);
          // trickle ice 
          setReceivingPc(pc);

          pc.onicecandidate = async (e) => {
              console.log("omn ice candidate on receiving seide");
              if (e.candidate) {
                 socket.emit("add-ice-candidate", {
                  candidate: e.candidate,
                  type: "receiver"
                 })
              }
          }

          pc.ontrack = (({track, type}) => {
              if (type == 'audio') {
                  // setRemoteAudioTrack(track);
                  // @ts-ignore
                  remoteVideoRef.current.srcObject.addTrack(track)
              } else {
                  // setRemoteVideoTrack(track);
                  // @ts-ignore
                  remoteVideoRef.current.srcObject.addTrack(track)
              }
              //@ts-ignore
              remoteVideoRef.current.play();
          })
          socket.emit("answer", {
              roomId,
              sdp: sdp
          });
      });

      socket.on("answer", ({roomId, sdp: remoteSdp}) => {
          setLobby(false);
          setSendingPc(pc => {
              pc?.setRemoteDescription(remoteSdp)
              return pc;
          });
          console.log("loop closed");
      })

      socket.on("lobby", () => {
          setLobby(true);
      })

      socket.on("add-ice-candidate", ({candidate, type}) => {
          console.log("add ice candidate from remote");
          console.log({candidate, type})
          if (type == "sender") {
              setReceivingPc(pc => {
                  pc?.addIceCandidate(candidate)
                  return pc;
              });
          } else {
              setReceivingPc(pc => {
                  pc?.addIceCandidate(candidate)
                  return pc;
              });
          }
      })

      setSocket(socket)
  }, [name])

  useEffect(() => {
      if (localVideoRef.current) {
          if (localVideoTrack) {
              localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
              localVideoRef.current.play();
          }
      }
  }, [localVideoRef])
  

  return (
    <div>
      {`hi, ${name}`}
      {/* <p onClick={()=>{changefirst()}}>{`${first}`}</p> */}
      <video autoPlay height={400} width={400} className='border border-pink-200' ref={localVideoRef}></video>
      {lobby ? 
      "waiting to connect you with someone !!" 
      : 
      <video autoPlay height={400} width={400} className='border border-pink-200'  ref={remoteVideoRef}></video>
      }
    </div>
  )
}

export default Room;
