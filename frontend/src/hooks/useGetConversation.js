import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import instance from '../utils/axiosInstance';

function useGetConversation() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const {
          data: { populatedChats },
        } = await instance.get('/chat');

        setConversations(populatedChats);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations, setConversations };
}

export default useGetConversation;
