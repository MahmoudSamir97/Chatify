import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import imgPlaceHolder from './../../assets/images/avatar.png';
import addIcon from './../../assets/images/add.png';
import notificationImg from './../../assets/images/notification.png';
import searchImg from './../../assets/images/search-interface-symbol.png';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import GroupChatModal from '../modals/groupChatModal/GroupChatModal';
import { useFetchContext } from '../../context/FetchContext';
import Notifications from '../modals/NotificationModal/Notifications';
import useConversation from '../../zustand/useConversation';
import instance from '../../utils/axiosInstance';

function Menu({ toggleSidebar }) {
  const { setAuthUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { authUser } = useAuthContext();
  const { notifications, setNotifications } = useFetchContext();
  const { setSelectedConversation } = useConversation();

  const handleLogOut = async () => {
    try {
      await instance.post('/auth/logout', {});
      setAuthUser(null);
      localStorage.removeItem('auth-user');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openGroupHandler = () => {
    setShowModal(true);
  };

  const closeGroupHandler = () => {
    setShowModal(false);
  };

  const openNotificaionsHandler = () => {
    setShowNotifications(true);
  };

  const closeNotificaionsHandler = () => {
    setShowNotifications(false);
  };

  const handleNotificationClick = (msg) => {
    setSelectedConversation(msg.chat);
    setNotifications(notifications.filter((n) => msg._id !== n._id));
    closeNotificaionsHandler();
  };

  return (
    <div
      style={{ width: '270px' }}
      className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 h-full  max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5"
    >
      <div className="mb-2 p-4 text-center">
        <div className="avatar mb-3">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={authUser.profileImage.secure_url || imgPlaceHolder}
              alt="profile"
            />
          </div>
        </div>
        <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">
          {authUser.username}
        </h5>
      </div>
      <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
        <Link
          to={'/profile'}
          tabIndex={0}
          className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
        >
          <div className="grid place-items-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Profile
        </Link>
        <Link
          to={'/'}
          tabIndex={0}
          onClick={openNotificaionsHandler}
          className="relative flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
        >
          <div className=" grid place-items-center mr-4">
            <img src={notificationImg} alt="notification" />
          </div>
          {notifications.length > 0 && (
            <div className="absolute inset-x-0">
              <div className="px-1  rounded-full text-center bg-red-500 text-white text-sm absolute -top-3 -end-2 z-10">
                {notifications.length}
                <div className="absolute top-0 right-0 rounded-full -z-10 animate-ping bg-red-200 w-full h-full"></div>
              </div>
            </div>
          )}
          Notifications
        </Link>
        {showNotifications && (
          <Notifications
            closeModal={closeNotificaionsHandler}
            handleNotificationClick={handleNotificationClick}
            notifs={notifications}
          />
        )}
        <div
          role="button"
          tabIndex={0}
          onClick={toggleSidebar}
          className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
        >
          <div className="grid place-items-center mr-4">
            <img src={searchImg} alt="search" />
          </div>
          Search for users
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={openGroupHandler}
          className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
        >
          <div className="grid place-items-center mr-4">
            <img src={addIcon} alt="add" />
          </div>
          Create group chat
        </div>
        {showModal && <GroupChatModal closeModal={closeGroupHandler} />}
        <div
          role="button"
          tabIndex={0}
          onClick={handleLogOut}
          className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-red-500 hover:bg-opacity-80 focus:bg-red-500  active:bg-blue-50 active:bg-opacity-80 hover:text-white focus:text-white active:text-blue-900 outline-none"
        >
          <div className="grid place-items-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Log Out
        </div>
      </nav>
    </div>
  );
}

export default Menu;
