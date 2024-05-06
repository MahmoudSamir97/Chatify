import React, { useRef, useState } from 'react';
import useGetConversation from '../../../hooks/useGetConversation';
import toast from 'react-hot-toast';
import UserBadgeItem from '../../userAvatar/UserBadgeItem';
import { Box } from '@chakra-ui/layout';
import { FaPlus } from 'react-icons/fa6';
import avatarImg from '../../../assets/images/avatar.png';
import { useFetchContext } from '../../../context/FetchContext';
import UserList from '../../utils/UserList';
import instance from '../../../utils/axiosInstance';

const GroupChatModal = ({ closeModal }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const { conversations, setConversations } = useGetConversation();
  const { fetchAgain, setFetchAgain } = useFetchContext();

  const [imagePreview, setImagePreview] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const [loading, setLoading] = useState(null);

  const groupImageRef = useRef();

  const resetCreateGroup = (group) => {
    setGroupName('');
    setImageFile(null);
    setImagePreview(null);
    setSelectedUsers([]);
    setConversations([...conversations, group]);
    setIsCreatingGroup(false);
    closeModal();

    toast.success('Chat group created successfully');
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast.error('User already added');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearchResult(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDelete = (user) => {
    setSelectedUsers(
      selectedUsers.filter((userObj) => userObj._id !== user._id),
    );
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsCreatingGroup(true);
      const sentData = new FormData();
      const usersToSend = selectedUsers.map((user) => user._id);
      sentData.append('groupName', groupName);
      sentData.append('users', usersToSend);
      if (imageFile) {
        sentData.append('groupImage', imageFile);
      }
      const { data } = await instance.post('/chat/create-group', sentData);
      resetCreateGroup(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      if (!error.response) return toast.error(error.message);

      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <div>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black bg-opacity-50 z-50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Group Chat
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
                data-modal-toggle="crud-modal"
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
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              {/* main */}
              <div>
                <div className=" w-full flex justify-center mb-1">
                  <div className="flex-col name-container">
                    <label
                      htmlFor="name"
                      className=" mb-3 inline-block text-sm  font-medium text-gray-900 dark:text-white"
                    >
                      Group Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="bg-gray-50 border block border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600   p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type group name"
                      required
                    />
                  </div>
                  <div className="relative avatar flex justify-center items-center flex-col w-full">
                    <span className="mb-2">Group image</span>
                    <div className="w-24 rounded-full">
                      <img src={imagePreview || avatarImg} alt="group" />
                    </div>
                    <input
                      type="file"
                      name="groupImage"
                      ref={groupImageRef}
                      onChange={handleFileChange}
                      hidden
                      accept="image/png, image/jpeg"
                    />
                    <FaPlus
                      onClick={() => groupImageRef.current.click()}
                      className="absolute bottom-0 text-2xl rounded-full hover:bg-red-400 text-white border bg-gray-500  cursor-pointer"
                    />
                  </div>
                </div>

                <div className="col-span-2 ">
                  <label
                    htmlFor="users"
                    className="block mb-2 mt-0 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Users
                  </label>
                  <input
                    type="text"
                    name="users"
                    id="users"
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-gray-50 border mb-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Add group users"
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
                        handleDelete={() => handleDelete(user)}
                      />
                    ))}
                  </Box>
                  {loading ? (
                    <div className="loading loading-spinner text-center my-2"></div>
                  ) : (
                    searchResult
                      ?.slice(0, 4)
                      .map((res) => (
                        <UserList
                          key={res?._id}
                          user={res}
                          handleFunction={() => handleGroup(res)}
                        />
                      ))
                  )}
                </div>
              </div>
              {isCreatingGroup && (
                <div className="text-center my-2">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add new group
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
