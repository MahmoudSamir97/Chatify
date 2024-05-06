import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';
import { useSocketContext } from '../context/SocketContext';
import instance from '../utils/axiosInstance';

function useGetMessages() {
  const { messages, setMessages, selectedConversation } = useConversation();
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();

  useEffect(() => {
    const getMessage = async () => {
      try {
        setLoading(true);

        const { data } = await instance.get(
          `/message/${selectedConversation?._id}`,
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
