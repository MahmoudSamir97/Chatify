import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSocketContext } from '../context/SocketContext';

function useGetMessages() {
  const { messages, setMessages, selectedConversation } = useConversation();
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();

  useEffect(() => {
    const getMessage = async () => {
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
    };
    if (selectedConversation?._id) getMessage();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
}

export default useGetMessages;
