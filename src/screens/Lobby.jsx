import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider';

export const Lobby = () => {
    const [email,setEmail] = useState("");
    const [room,setRoom] = useState("");

    const socket = useSocket();

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();
        socket.emit('room:join', {email, room})
    }, [email, room, socket]);

    const handleJoinRoom = useCallback((data) => {
      const {email, room } = data  
    },[]);

    useEffect(() => {
      socket.on('room:join', handleJoinRoom);
      return () => {
        socket.off('room:join', handleJoinRoom);
      }
    }, [socket, handleJoinRoom]);

  return (
    <div>
        <h1>Lobby</h1>
        <form onSubmit={handleSubmitForm}>
            <label htmlFor='email'>Email</label>
            <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label htmlFor="room">Room No.</label>
            <input type="number" id='room' value={room} onChange={(e) => setRoom(e.target.value)}/>
            <button>Join</button>
        </form>
    </div>
  )
}
