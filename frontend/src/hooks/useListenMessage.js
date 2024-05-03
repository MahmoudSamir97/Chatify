import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import notificationSound from '../assets/sounds/notification.mp3';

function useListenMessage() {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();
  console.log(messages);

  useEffect(() => {
    socket?.on('message recieved', (newMessage) => {
      console.log(newMessage, 'newMessage 💖💖💖💖💖');
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });
    return () => socket?.off('message recieved');
  }, [socket, setMessages, messages]);
}

export default useListenMessage;
