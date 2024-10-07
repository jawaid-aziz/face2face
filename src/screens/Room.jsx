import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'

export const RoomPage = () => {

    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    
    const handleUserJoined = useCallback( ({email,id}) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    },[]); 

    const handleCallUser = () => {
        
    }

    useEffect( () => {
        socket.on('user:joined', handleUserJoined);
        return () => { socket.off('user:joined', handleUserJoined) };
    },[socket, handleUserJoined]);

  return (
    <div>
        <h1>Room</h1>
        <h4>{remoteSocketId ? "connected" : "No one in room"}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
    </div>

  )
}
