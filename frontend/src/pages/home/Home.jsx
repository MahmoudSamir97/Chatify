import React from "react";
import "./Home.css";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import Menu from "../../components/sidebar/Menu";
import useConversation from "../../zustand/useConversation";

function Home() {
  const { sele } = useConversation();
  return (
    <div className="home p-4 h-screen flex items-center justify-center">
      <div className=" flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Menu />
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
}

export default Home;
