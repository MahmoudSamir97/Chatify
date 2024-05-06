import React from 'react';
import './Home.css';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';
import { FetchProvider } from '../../context/FetchContext';

function Home() {
  return (
    <FetchProvider>
      <div className="home  h-screen flex items-center justify-center">
        <div className="flex w-full h-screen  rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <Sidebar />
          <MessageContainer />
        </div>
      </div>
    </FetchProvider>
  );
}

export default Home;
