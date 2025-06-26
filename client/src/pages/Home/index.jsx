

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { useSelector } from 'react-redux';
import {io} from "socket.io-client";
import { useEffect } from 'react';

// make the socket connection to the server
const socket = io("http://localhost:3000");

const Home = () => {

  const {selectedChat, user} = useSelector((state) => state.userReducer);

  // handle socket events
  useEffect(() => {

    if(user) {
      socket.emit("join-room", user._id);
    }
    
  }, [user]);


  
  return (
    <>
      <div className="home-page">
          {/* header  */}
          <Header />
        <div className="main-content">
         
          {/* SIDEBAR LAYOUT  */}
          <Sidebar  socket={socket} />
          {/* CHAT AREA LAYOUT  */}
          {selectedChat && <Chat socket={socket} />}
        </div>
      </div>
    </>
  )
}


export default Home;