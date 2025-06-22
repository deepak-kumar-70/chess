import React, { useState } from "react";
import king from "../assets/img/King.png";
import { motion } from "framer-motion";
import { SiChessdotcom } from "react-icons/si";
import socket from "./utilities/socket";
const LoadingPage = ({setName,setRoomId,name,roomId ,isJoined,setIsJoined}) => {
   const handleJoinRoom = () => {
    if(name&&roomId) {
      setIsJoined(true);
      socket.emit("room:join", { name, roomId });
    }
   }
  return (
    <div className="bg-slate-950 h-screen relative w-full flex justify-center items-center">
    
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <img src={king} alt="Loading..." />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.1,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bg-slate-900/70 w-[360px] h-[400px] rounded-2xl flex flex-col items-center px-6 py-4 border border-slate-700 text-white shadow-2xl backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]"
      >
        <h1 className="text-2xl font-semibold font-mono text-center mt-2 tracking-wide text-blue-400">
          Play Chess with Friends
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
            onChange={(e)=>setName(e.target.value)}
            value={name}
          className="mt-8 px-4 py-2 rounded-md border border-slate-600 w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <input
          type="text"
          placeholder="Enter room ID"
          onChange={(e)=>setRoomId(e.target.value)}
          value={roomId}
          className="mt-4 px-4 py-2 rounded-md border border-slate-600 w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
        onClick={handleJoinRoom}
        className="mt-6 w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg">
          Join Room
        </button>

        <p className="mt-6 text-sm text-slate-400 text-center italic">
          Don't have a room? Share your ID with a friend to start.
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingPage;
