import { useState } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSocketContext } from '../context/SocketContext';

function useSendMessages() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext();

  const token = localStorage.getItem('token').replace(/^"|"$/g, ''); // Remove surrounding quotes
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const sendMessage = async (message) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        '/message',
        { chatId: selectedConversation._id, content: message },
        config,
      );
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
