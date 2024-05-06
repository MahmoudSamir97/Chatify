import { useState } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';
import { useSocketContext } from '../context/SocketContext';
import instance from '../utils/axiosInstance';

function useSendMessages() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext();

  const sendMessage = async (message) => {
    try {
      setLoading(true);

      socket?.emit('stop typing', selectedConversation?._id);

      const { data } = await instance.post('/message', {
        chatId: selectedConversation._id,
        content: message,
      });

      setMessages([...messages, data.newMessage]);

      socket.emit('newMessage', data.newMessage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
}

export default useSendMessages;
