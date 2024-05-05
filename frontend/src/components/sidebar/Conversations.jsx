import React, { useEffect, useState } from 'react';
import Conversation from './Conversation';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useFetchContext } from '../../context/FetchContext';

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchAgain } = useFetchContext();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token').replace(/^"|"$/g, ''); // Remove surrounding quotes
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get('/chat', config);
      setConversations(data.populatedChats);
    } catch (error) {
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div
      className="flex relative flex-col h-full w-full overflow-auto flex-grow"
      style={{ width: '30rem' }}
    >
      <h1 className="text-center py-2 mb-5 text-2xl text-gray-400">Chats</h1>
      {conversations &&
        conversations?.map((conv, idx) => (
          <Conversation
            key={conv?._id}
            conversation={conv}
            lastIdx={idx === conversations.length - 1}
          />
        ))}
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading loading-spinner"></div>
        </div>
      ) : null}
    </div>
  );
}

export default Conversations;
