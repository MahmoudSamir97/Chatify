import React, { useEffect, useState } from 'react';
import Conversation from './Conversation';
import toast from 'react-hot-toast';
import { useFetchContext } from '../../context/FetchContext';
import instance from '../../utils/axiosInstance';

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const { fetchAgain } = useFetchContext();

  const fetchChats = async () => {
    try {
      const { data } = await instance.get('/chat');
      console.log(data);
      setConversations(data.populatedChats);
    } catch (error) {
      toast(error.message);
    } finally {
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

      {conversations?.length ? (
        conversations?.map((conv, idx) => (
          <Conversation
            key={conv?._id}
            conversation={conv}
            lastIdx={idx === conversations.length - 1}
          />
        ))
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-xl mb-2 text-red-400">No chats yet..</h1>
          <p className="text-slate-400">
            search for users to start chatting 💬
          </p>
        </div>
      )}
    </div>
  );
}

export default Conversations;
