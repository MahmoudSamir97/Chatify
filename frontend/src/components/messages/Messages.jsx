import React, { useEffect, useRef } from 'react';
import Message from './Message';
import MessageSkeleton from '../skeletons/MessageSceleton';
import notificationSound from '../../assets/sounds/notification.mp3';
import { useFetchContext } from '../../context/FetchContext';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';
import useGetMessages from '../../hooks/useGetMessages';
import { throttle } from 'lodash';

function Messages() {
  const lastMsgRef = useRef();
  const { loading } = useGetMessages();
  const { socket } = useSocketContext();
  const { setMessages, messages, selectedConversation } = useConversation();
  const { notifications, setNotifications } = useFetchContext();

  useEffect(() => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const throttledHandleMessageReceived = throttle((newMessage) => {
      if (newMessage.chat._id !== selectedConversation?._id) {
        setNotifications([newMessage, ...notifications]);
      } else {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, newMessage]);
      }
    }, 1000);

    socket.on('message received', throttledHandleMessageReceived);

    return () => socket.off('message received', throttledHandleMessageReceived);
  }, [
    socket,
    setMessages,
    messages,
    notifications,
    setNotifications,
    selectedConversation,
  ]);

  return (
    <div
      className="relative px-4 flex-1 overflow-auto"
      style={{
        overflowY: 'scroll',
      }}
    >
      {!loading &&
        messages?.length > 0 &&
        messages?.map((message, index) => (
          <div key={`${message._id}_${index}`} ref={lastMsgRef}>
            <Message message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center text text-sm text-gray-400">
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
}

export default Messages;
