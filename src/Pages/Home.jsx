import React from "react";
import ChessBoard from "../Components/ChessBoard";
import LoadingPage from "../Components/LoadingPage";
import { useState } from "react";
const Home = () => {
   const [name,setName]=useState("");
    const [roomId,setRoomId]=useState("");
    const [isJoined, setIsJoined] = useState(false);
  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-950">
      {
           isJoined?
          <ChessBoard name={name} roomId={roomId}/>:
          <LoadingPage setName={setName} setRoomId={setRoomId} name={name} roomId={roomId} isJoined={isJoined} setIsJoined={setIsJoined}/>
          
      }
    </div>
  );
};

export default Home;
