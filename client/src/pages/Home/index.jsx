

import React from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const Home = () => {




  
  return (
    <>
      <div className="home-page">
          {/* header  */}
          <Header />
        <div className="main-content">
         
          {/* SIDEBAR LAYOUT  */}
          <Sidebar />
          {/* CHAT AREA LAYOUT  */}
        </div>
      </div>

    </>
  )
}


export default Home;