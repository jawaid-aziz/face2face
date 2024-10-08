import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import { useSocket } from '../context/SocketProvider';
import peer from "../service/peer";

export const RoomPage = () => {

    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();

    const handleUserJoined = useCallback( ({email,id}) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    },[]); 

    const handleCallUser = useCallback(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user: call", {to: remoteSocketId, offer});
        setMyStream(stream);
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    }, [remoteSocketId, socket]);
    
    const handleIncomingCall = useCallback( ({from,offer}) => {
      console.log(`Incoming Call`, from, offer);
    }, []);    

    useEffect( () => {
        socket.on('user:joined', handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);

        return () => { 
        socket.off('user:joined', handleUserJoined);
        socket.off("incoming:call", handleIncomingCall);
      };
    },  [socket, handleUserJoined, handleIncomingCall]);

  return (
    <div>
        <h1>Room</h1>
        <h4>{remoteSocketId ? "connected" : "No one in room"}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
        {
          myStream && (
            <>
            <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="200px"
            url={myStream}
          />
          </>
        )}
    </div>
  )
}
