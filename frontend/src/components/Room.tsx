"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Navbar from "./navbar";

const URL = process.env.NEXT_PUBLIC_API_URL;

const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  const [lobby, setLobby] = useState(true);
//   const [videoSwitch, setvideoSwitch] = useState(true);
  let videoSwitch = true;
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  setTimeout(() => {
    if (
      socket &&
      sendingPc &&
      receivingPc &&
      remoteAudioTrack &&
      remoteMediaStream &&
      remoteVideoTrack
    ) {
    //   console.log("all fine till now");
    }
  }, 3000);

  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }) => {
      console.log("sending offer");
      setLobby(false);
      const pc = new RTCPeerConnection();

      setSendingPc(pc);
      if (localVideoTrack) {
        pc.addTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        pc.addTrack(localAudioTrack);
      }

      pc.onicecandidate = async (e) => {
        console.log("receiving ice candidate locally");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation neeeded, sending offer");
        const sdp = await pc.createOffer();
        pc.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };
    });

    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      console.log("received offer");
      setLobby(false);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(remoteSdp);
      const sdp = await pc.createAnswer();
      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteMediaStream(stream);
      setReceivingPc(pc);

      //   window.pcr = pc;

      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        console.log("omn ice candidate on receiving seide");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "receiver",
            roomId,
          });
        }
      };

      socket.emit("answer", {
        roomId,
        sdp: sdp,
      });

      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;
        console.log(track1);
        if (track1.kind === "video") {
          setRemoteAudioTrack(track2);
          setRemoteVideoTrack(track1);
        } else {
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }
        //@ts-expect-error Add track to srcObject if available
        remoteVideoRef.current?.srcObject?.addTrack(track1);

        //@ts-expect-error Add track to srcObject if available
        remoteVideoRef.current?.srcObject?.addTrack(track2);

        remoteVideoRef.current?.play();
      }, 1500);
    });

    socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
      setLobby(false);
      console.log(roomId);
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp);
        return pc;
      });
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("add ice candidate from remote");
      console.log({ candidate, type });
      if (type == "sender") {
        setReceivingPc((pc) => {
          if (!pc) {
            console.error("receicng pc nout found");
          } else {
            console.error(pc.ontrack);
          }
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          if (!pc) {
            console.error("sending pc nout found");
          }
          pc?.addIceCandidate(candidate);
          return pc;
        });
      }
    });

    setSocket(socket);
  }, [name]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);

        localVideoRef.current.play();
      }
    }
  }, [localVideoRef]);

  const switchVideo = () => {
    // setvideoSwitch(!videoSwitch);
    videoSwitch = !videoSwitch;
    console.log(videoSwitch);
  };

//   console.log("type of localVideoRef : ", typeof localVideoRef);

  return (
    <div>
      <Navbar />
      <div className="pt-20">
        {/* {`hi, ${name}`} */}
        <div className="w-8/12 flex m-auto justify-around max-lg:flex-col relative max-md:w-11/12">
          {!lobby ? (
            <div>
              {videoSwitch ? (
                <video
                  autoPlay
                  className="border border-pink-200 max-lg:m-auto h-[75vh] w-full rounded-lg max-sm:h-[85vh]"
                  // style={{ objectFit: 'scale-down' }}
                  style={{ transform: "scaleX(-1)" }}
                  ref={remoteVideoRef}
                ></video>
              ) : (
                <video
                  autoPlay
                  className="border border-pink-200 max-lg:m-auto h-[75vh] w-full rounded-lg max-sm:h-[85vh]"
                  // style={{ objectFit: 'scale-down' }}
                  style={{ transform: "scaleX(-1)" }}
                  ref={localVideoRef}
                ></video>
              )}
            </div>
          ) : (
            <div className="border border-pink-200 max-lg:m-auto h-[75vh] w-full rounded-lg m-auto flex justify-center  max-sm:h-[85vh] ">
              <p className="flex flex-col justify-center">
                waiting to connect you with someone !!
              </p>
            </div>
          )}

          <div onClick={() => switchVideo()} className="absolute bottom-2 right-2">
          {!videoSwitch ? (
                <video
                autoPlay
                className="border border-pink-200 max-lg:m-auto bg-blue-300 rounded-lg h-[150px] w-[200px] max-md:w-[100px]"
                style={{ objectFit: "cover", transform: "scaleX(-1)" }}
                ref={remoteVideoRef}
              ></video>
              ) : (
                <video
              autoPlay
              className="border border-pink-200 max-lg:m-auto bg-blue-300 rounded-lg h-[150px] w-[200px] max-md:w-[100px]"
              style={{ objectFit: "cover", transform: "scaleX(-1)" }}
              ref={localVideoRef}
            ></video>
              )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
