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
  const remoteVideoRef = useRef<any>();
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
                  type: "sender",
                  roomId
                 })
              }
          }

          pc.onnegotiationneeded = async () => {
              console.log("on negotiation neeeded, sending offer");
              const sdp = await pc.createOffer();
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
          pc.setLocalDescription(sdp)
          const stream = new MediaStream();
          if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
          }
          setRemoteMediaStream(stream);
          setReceivingPc(pc);
          //@ts-ignore
          window.pcr = pc;
          pc.ontrack = (e) => {
            alert("alert");
          }

          pc.onicecandidate = async (e) => {
              if(!e.candidate) {
                return;
              }
              console.log("omn ice candidate on receiving seide");
              if (e.candidate) {
                 socket.emit("add-ice-candidate", {
                  candidate: e.candidate,
                  type: "receiver",
                  roomId
                 })
              }
          }


          socket.emit("answer", {
            roomId,
            sdp: sdp
        });
        setTimeout(() => {
            const track1 = pc.getTransceivers()[0].receiver.track
            const track2 = pc.getTransceivers()[1].receiver.track
            console.log(track1);
            if (track1.kind === "video") {
                setRemoteAudioTrack(track2)
                setRemoteVideoTrack(track1)
            } else {
                setRemoteAudioTrack(track1)
                setRemoteVideoTrack(track2)
            }
            remoteVideoRef.current.srcObject.addTrack(track1)
            remoteVideoRef.current.srcObject.addTrack(track2)
            remoteVideoRef.current.play();
        }, 500)
    });


      socket.on("answer", ({roomId, sdp: remoteSdp}) => {
          setLobby(false);
          setSendingPc(pc => {
              pc?.setRemoteDescription(remoteSdp)
              return pc;
          });
      })

      socket.on("lobby", () => {
          setLobby(true);
      })

      socket.on("add-ice-candidate", ({candidate, type}) => {
          console.log("add ice candidate from remote");
          console.log({candidate, type})
          if (type == "sender") {
              setReceivingPc(pc => {
                if (!pc) {
                  console.error("receicng pc nout found")
              } else {
                  console.error(pc.ontrack)
              }
              pc?.addIceCandidate(candidate)
              return pc;
              });
          } else {
              setSendingPc(pc => {
                if (!pc) {
                  console.error("sending pc nout found")
              }
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
