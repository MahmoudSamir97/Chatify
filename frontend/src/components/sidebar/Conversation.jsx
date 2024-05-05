import React from 'react';
import useConversation from '../../zustand/useConversation';
import profileImgPlaceholder from './../../assets/images/avatar.png';
import groupImgPlaceholder from './../../assets/images/group3.png';
import { useSocketContext } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';

function Conversation({ conversation, lastIdx }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const reciever = conversation.users.find((user) => user._id !== authUser._id);
  const isOnline = onlineUsers.includes(reciever?._id);

  const lastMsg = conversation.latestMessage;

  const chatName = conversation.isGroupChat
    ? conversation.chatName
    : reciever.username;

  const privateChatImg =
    reciever.profileImage.secure_url || profileImgPlaceholder;

  const groupChatImg =
    conversation.chatImage?.secure_url || groupImgPlaceholder;

  return (
    <>
      <div
        className={`flex gap-3  hover:bg-gray-700 rounded p-2 my-2 cursor-pointer ${
          isSelected ? 'bg-gray-700' : ''
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? ' online' : ''}`}>
          <div className="w-12 rounded-full">
            <img
              src={conversation.isGroupChat ? groupChatImg : privateChatImg}
              alt="user profile"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{chatName}</p>
          </div>
          {lastMsg ? (
            <div className="flex justify-start mt-1 items-center ">
              <p
                className="text-slate-400 text-sm"
                style={{ fontWeight: '700' }}
              >
                {lastMsg.sender.username} :
              </p>
              <span className="text-sm text-slate-400 ml-1">
                {' '}
                {lastMsg.content}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
}

export default Conversation;
