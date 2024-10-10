import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import { useSocket } from '../context/SocketProvider';
import peer from "../service/peer";

export const RoomPage = () => {

    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

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
        socket.emit("user:call", {to: remoteSocketId, offer});
        setMyStream(stream);

      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    }, [remoteSocketId, socket]);
    
    const handleIncomingCall = useCallback( async({from,offer}) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer); 
      socket.emit('call:accepted', {to:from, ans});
    }, [socket]);

    const handleCallAccepted = useCallback( (from, ans) => {
      peer.setLocalDescription(ans);
      console.log('Call Accepted');
      for (const track of myStream.getTracks()){
        peer.peer.addTrack(track, myStream);
      }
    }, [myStream]);

    const handleNegoNeeded = useCallback(async() => {
      const offer = await peer.getOffer();
      socket.emit('peer:nego:needed', {offer, to: remoteSocketId});
    }, []);

    useEffect(() => {
      peer.peer.addEventListener('negotiationNeeded', handleNegoNeeded);
      return () => { peer.peer.removeEventListener('negotiationNeeded', handleNegoNeeded)};
    },[handleNegoNeeded]);

    useEffect(() => {
      peer.peer.addEventListener('track', async ev => {
        const remoteStream = ev.streams;
        setRemoteStream(remoteStream);
      });

    }, []);

    useEffect( () => {
        socket.on('user:joined', handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on('call:accepted', handleCallAccepted);

        return () => { 
        socket.off('user:joined', handleUserJoined);
        socket.off("incoming:call", handleIncomingCall);
        socket.off("call:accepted", handleCallAccepted);
      };
    },  [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

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
        {
          remoteStream && (
            <>
            <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="200px"
            url={remoteStream}
          />
          </>
        )}
    </div>
  )
}
