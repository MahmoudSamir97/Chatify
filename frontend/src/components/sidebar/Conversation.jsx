import React from 'react';
import useConversation from '../../zustand/useConversation';
import imgPlaceHolder from './../../assets/images/avatar.png';
import { useSocketContext } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';

function Conversation({ conversation, lastIdx }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const reciever = conversation.users.find((user) => user._id !== authUser._id);
  const isOnline = onlineUsers.includes(reciever?._id);
  const chatName = conversation.isGroupChat
    ? conversation.chatName
    : reciever.username;

  const chatImg = conversation.isGroupChat
    ? conversation.chatImage?.secure_url
    : reciever?.profileImage.secure_url;

  return (
    <>
      <div
        className={`flex gap-3  hover:bg-sky-500 rounded p-2 my-2 cursor-pointer ${
          isSelected ? 'bg-sky-500' : ''
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? ' online' : ''}`}>
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
