import React, { useState } from 'react';
import toast from 'react-hot-toast';
import UserList from '../utils/UserList';
import useGetConversation from '../../hooks/useGetConversation';
import useConversation from '../../zustand/useConversation';
import { useFetchContext } from '../../context/FetchContext';
import instance from '../../utils/axiosInstance';

function SearchUser() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const { setSelectedConversation } = useConversation();
  const [loading, setLoading] = useState('');
  const { conversations, setConversations } = useGetConversation();
  const { fetchAgain, setFetchAgain } = useFetchContext();

  const accessChat = async (userId) => {
    try {
      setLoading(true);

      const {
        data: { newChatWithPopulated },
      } = await instance.post('/chat', { userId });

      const isChatFound = conversations.find(
        (c) => c._id === newChatWithPopulated._id,
      );

      setSelectedConversation(newChatWithPopulated);
      if (!isChatFound) {
        setConversations([...conversations, newChatWithPopulated]);
      }
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);
      if (!search)
        return toast.error('Search input is empty', {
          position: 'top-left',
        });

      if (search.length < 3)
        return toast.error('Search input must be at least 3 characters', {
          position: 'top-left',
        });

      const { data } = await instance.get(`/user/find?search=${search}`);

      if (!data.length)
        toast.error('No users founded', { position: 'top-left' });

      setSearchResult(data);

      setLoading(false);
    } catch (error) {
      toast.error(error.message, {
        position: 'top-left',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ width: '260px' }}
      className="bg-clip-border rounded-xl mx-2 bg-white text-gray-700 h-full  max-w-[20rem]  shadow-xl shadow-blue-gray-900/5"
    >
      <div className="flex flex-col items-center justify-center mt-2 ">
        <form onSubmit={handleSubmit} className="mb-1">
          <div className="relative text-gray-600 ">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="submit"
                className="mt-2 focus:outline-none focus:shadow-outline"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  className="w-6 h-6 hover:text-red-700"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm border mt-2 p-2 border-gray-400 focus:border-gray-600 rounded-md pl-10 focus:outline-none text-gray-900"
              placeholder="Search by username"
            />
          </div>
        </form>
        <div
          className=" flex flex-col justify-center max-h-full items-start p-1 text-gray-700 rounded-xl overflow-y-auto overflow-x-hidden"
          style={{
            maxHeight: '38rem',
            paddingTop: searchResult?.length >= 12 ? '4.5rem' : '',
          }}
        >
          {loading ? (
            <div className="loading loading-spinner text-center mt-2"></div>
          ) : (
            searchResult?.map((res) => (
              <UserList
                key={res?._id}
                user={res}
                handleFunction={() => accessChat(res._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchUser;
