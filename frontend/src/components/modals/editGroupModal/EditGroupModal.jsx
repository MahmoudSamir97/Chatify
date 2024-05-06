import React, { useRef, useState } from 'react';
import useGetConversation from '../../../hooks/useGetConversation';
import avatarImg from '../../../assets/images/avatar.png';
import plusImg from '../../../assets/images/plus.png';
import UserBadgeItem from '../../userAvatar/UserBadgeItem';
import { Box } from '@chakra-ui/layout';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../../context/AuthContext';
import useConversation from '../../../zustand/useConversation';
import UserList from '../../utils/UserList';
import { useFetchContext } from '../../../context/FetchContext';
import instance from '../../../utils/axiosInstance';

function EditGroupModal({ chat, closeModal }) {
  const [chatName, setchatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(chat.users);
  const { conversations, setConversations } = useGetConversation();
  const [imagePreview, setImagePreview] = useState(chat.chatImage.secure_url);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const { fetchAgain, setFetchAgain } = useFetchContext();

  const groupImageRef = useRef();

  const successHandler = (updatedChat) => {
    setSelectedConversation(updatedChat);
    setConversations([updatedChat, ...conversations]);
    setFetchAgain(!fetchAgain);
    toast.success('Group updated successfully');
  };

  const handleGroupRename = async () => {
    try {
      setLoading(true);

      if (!chatName) return;
      const { data } = await instance.patch('/chat/rename-group', {
        chatId: selectedConversation._id,
        chatName,
      });

      successHandler(data.updatedChat);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      setLoading(true);

      if (selectedConversation.groupAdmin._id !== authUser._id)
        return toast.error('Only admin can remove users');

      if (user._id === authUser._id)
        return toast.error('Can not remove admin from users');

      setSelectedUsers(
        selectedUsers.filter((userObj) => userObj._id !== user._id),
      );
      const { data } = await instance.patch('/chat/remove-user', {
        chatId: selectedConversation._id,
        userId: user._id,
      });

      successHandler(data.updatedChat);
    } catch (error) {
      if (!error.response) return toast.error(error.message);

      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    try {
      setLoading(true);
      if (selectedUsers.some((user) => user._id === userToAdd._id)) {
        toast.error('User already added');
        return;
      }
      if (selectedConversation.groupAdmin._id !== authUser._id) {
        toast('Only admins can add someone!');
        return;
      }
      setSelectedUsers([...selectedUsers, userToAdd]);
      setSearchResult(null);
      const { data } = await instance.patch('/chat/add-user', {
        chatId: selectedConversation._id,
        userId: userToAdd._id,
      });

      successHandler(data.updatedChat);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeImage = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('chatImage', file);
      formData.append('chatId', selectedConversation._id);

      const { data } = await instance.patch('/chat/update-image', formData);

      successHandler(data.updatedChat);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      if (!query) {
        setSearchResult(null);
        return;
      }

      const { data } = await instance.get(`/user/find?search=${query}`);

      if (!data) {
        setSearchResult(null);

        toast.error('No such user found');
      }
      setSearchResult(data);
    } catch (error) {
      console.error('Error occurred while searching:', error);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (user) => {
    try {
      setLoading(true);
      if (selectedConversation.groupAdmin._id !== authUser._id)
        return toast.error('You are not allowed to delete Group');

      await instance.post('/chat/delete-group', {
        chatId: selectedConversation._id,
      });

      setSelectedConversation(null);
      setConversations([...conversations]);
      setFetchAgain(!fetchAgain);

      toast.success('Group deleted successfully');
    } catch (error) {
      if (!error.response) return toast.error(error.message);

      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-screen flex justify-center overflow-auto items-center bg-black bg-opacity-50 z-50 "
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex  items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl text-center font-semibold text-gray-900 dark:text-white w-full">
              {chat.chatName}
            </h3>
            <button
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
              onClick={closeModal}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form className="space-y-4" action="#">
              <div>
                <label
                  htmlFor="groupname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Group Name
                </label>
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setchatName(e.target.value)}
                    id="groupname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder={chat.chatName}
                  />
                  <button
                    type="button"
                    onClick={handleGroupRename}
                    className="text-white bg-gradient-to-r ms-5 mt-2 from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2"
                  >
                    Update Name
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <label
                  htmlFor="users"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Users
                </label>
                <input
                  type="text"
                  id="users"
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="add users"
                  className="bg-gray-50 border mb-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
                <Box
                  width="100%"
                  display="flex"
                  flexWrap="wrap"
                  className="mb-2"
                >
                  {selectedUsers.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleDelete={() => handleDeleteUser(user)}
                    />
                  ))}
                </Box>
                {searchResult?.slice(0, 4).map((user) => (
                  <UserList
                    key={user?._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </div>
              <div className="relative w-full text-center mb-2">
                <label
                  htmlFor="users"
                  className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Group image
                </label>
                <div className="w-full flex justify-center items-center">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={imagePreview || avatarImg} alt="group" />
                    </div>
                  </div>
                  <input
                    type="file"
                    name="groupImage"
                    ref={groupImageRef}
                    onChange={handleChangeImage}
                    hidden
                    accept="image/png, image/jpeg"
                  />
                  <img
                    src={plusImg}
                    onClick={() => groupImageRef.current.click()}
                    alt="add"
                    className="absolute bottom-1 cursor-pointer"
                  />
                </div>
              </div>
              {loading && (
                <div className="flex justify-center items-center mt-2">
                  <div className="loading loading-spinner text-black text-center"></div>
                </div>
              )}

              <button
                type="button"
                onClick={handleDeleteGroup}
                className="py-2 px-3 w-full text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Delete group
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGroupModal;
