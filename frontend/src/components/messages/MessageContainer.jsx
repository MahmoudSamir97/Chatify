import React, { useEffect, useState } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from 'react-icons/ti';
import useConversation from '../../zustand/useConversation';
import dotsIcon from '../../assets/images/icons8-three-dots-50.png';
import EditGroupModal from '../modals/editGroupModal/EditGroupModal';
import Lottie from 'react-lottie';
import animationData from '../../assets/animations/typing.json';
import { useAuthContext } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

function MessageContainer({ fetchAgain, setFetchAgain }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    selectedConversation,
    setSelectedConversation,
    setMessages,
    typing,
    messages,
  } = useConversation();
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const reciever = selectedConversation?.users.find(
    (user) => user._id !== authUser._id,
  );

  useEffect(() => {
    const debouncedGetMessage = debounce(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token').replace(/^"|"$/g, ''); // Remove surrounding quotes
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get(
          `/message/${selectedConversation?._id}`,
          config,
        );

        setMessages(data.messages);
        socket.emit('join chat', selectedConversation?._id);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, 1000);

    if (selectedConversation?._id) debouncedGetMessage();
  }, [selectedConversation?._id, setMessages]);

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  const handleDotsClick = () => {
    setShowEditModal(!showEditModal);
  };

  const closeModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className=" flex flex-col flex-5 p-2" style={{ width: '73rem' }}>
      {selectedConversation ? (
        <>
          {selectedConversation?.isGroupChat ? (
            <>
              <div className="relative bg-slate-500 px-4 py-2 mb-2">
                <span className="label-text ">To:</span>{' '}
                <span className="text-gray-900 font-bold">
                  {selectedConversation?.chatName}
                </span>
                <div
                  className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
                  onClick={handleDotsClick}
                >
                  <img src={dotsIcon} alt="dots" width={24} />
                </div>
              </div>
              {showEditModal && (
                <EditGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  chat={selectedConversation}
                  closeModal={closeModal}
                />
              )}
            </>
          ) : (
            <div className="bg-slate-500 px-4 py-2 mb-2">
              <span className="label-text">To:</span>{' '}
              <span className="text-gray-900 font-bold">
                {reciever.username}
              </span>
            </div>
          )}
          <Messages messages={messages} loading={loading} />
          {typing ? (
            <div
              className=" flex justify-start text-start text-white "
              style={{ marginRight: '33rem' }}
            >
              <Lottie options={defaultOptions} width={70} />
            </div>
          ) : null}
          <MessageInput />
        </>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
}

const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.username} </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
export default MessageContainer;
