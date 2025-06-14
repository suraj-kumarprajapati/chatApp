

import React from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { useSelector } from 'react-redux';

const Home = () => {

  const {selectedChat} = useSelector((state) => state.userReducer);


  
  return (
    <>
      <div className="home-page">
          {/* header  */}
          <Header />
        <div className="main-content">
         
          {/* SIDEBAR LAYOUT  */}
          <Sidebar />
          {/* CHAT AREA LAYOUT  */}
          {selectedChat && <Chat />}
        </div>
      </div>
    </>
  )
}


export default Home;