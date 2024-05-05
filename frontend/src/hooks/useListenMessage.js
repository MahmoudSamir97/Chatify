import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import notificationSound from '../assets/sounds/notification.mp3';
import { useFetchContext } from '../context/FetchContext';

function useListenMessage() {
  const { socket } = useSocketContext();
  const { setMessages, messages, selectedConversation } = useConversation();
  const { notifications, setNotifications } = useFetchContext();
  const selectedCompareChat = selectedConversation;

  useEffect(() => {
    if (!socket) return;
    const handleMessageReceived = (newMessage) => {
      console.log(newMessage, 'message received 😎😎😎😎😎');
      console.log(selectedCompareChat);
      if (
        !selectedCompareChat ||
        newMessage.chat._id !== selectedConversation?._id
      ) {
        if (!notifications.includes(newMessage)) {
          setNotifications([newMessage, ...notifications]);
        }
      } else {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, newMessage]);
      }
    };
    socket.on('message received', handleMessageReceived);

    return () => socket.off('message received', handleMessageReceived);
  }, [socket, setMessages, messages]);
}

export default useListenMessage;
