import React from "react";
import useConversation from "../../zustand/useConversation";

import imgPlaceHolder from "./../../assets/images/avatar.png";
import { useSocketContext } from "../../context/SocketContext";

function Conversation({ conversation, lastIdx }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation?.users[1]?._id);
  const chatName = conversation.isGroupChat
    ? conversation.chatName
    : conversation.users[1].username;

  const chatImg = conversation.isGroupChat
    ? conversation.chatImage.secure_url
    : conversation.users[1].profileImage.secure_url;

  return (
    <>
      <div
        className={`flex gap-3  hover:bg-sky-500 rounded p-2 my-2 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? " online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={chatImg || imgPlaceHolder} alt="user profile" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{chatName}</p>
          </div>
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
}

export default Conversation;
