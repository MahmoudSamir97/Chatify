import React, { useState } from "react";
import "./Home.css";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import Menu from "../../components/sidebar/Menu";

function Home() {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="home  h-screen flex items-center justify-center">
      <div className="flex w-full h-screen  rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebar fetchAgain={fetchAgain} />
        <MessageContainer
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      </div>
    </div>
  );
}

export default Home;

// sm:h-[450px] md:h-[550px]
