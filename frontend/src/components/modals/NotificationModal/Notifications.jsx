import React from 'react';
import profileImgPlaceholder from './../../../assets/images/avatar.png';

function Notifications({ closeModal, notifs, handleNotificationClick }) {
  const renderNotification = notifs.map((msg) => (
    <div
      onClick={() => handleNotificationClick(msg)}
      className="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2 cursor-pointer"
      key={msg._id}
    >
      <img
        className="h-8 w-8 rounded-full object-cover mx-1"
        src={msg.sender.profileImage.secure_url || profileImgPlaceholder}
        alt="avatar"
      />
      <p className="text-gray-600 text-sm mx-2">
        <span className="font-bold" href="#">
          {msg.sender.username}
        </span>{' '}
        sent you a message{' '}
        {msg.chat.isGroupChat ? (
          <span>
            in
            <span className="font-bold text-blue-500">
              {' '}
              {msg.chat.chatName}
            </span>
          </span>
        ) : (
          ''
        )}
      </p>
    </div>
  ));

  console.log(renderNotification, 'render');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        className="mt-4 bg-white rounded-md shadow-lg overflow-hidden z-20 "
        style={{ width: '20rem' }}
      >
        <div className="close-container flex justify-end items-center m-1 p-2">
          <h1 className="text-xl mx-auto w-full text-red-500 text-center">
            Notifications
          </h1>
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
        <div
          className="py-2 overflow-y-scroll overflow-x-hidden"
          style={{ maxHeight: '20rem' }}
        >
          {notifs.length > 0 ? (
            renderNotification
          ) : (
            <div className="text-center p-4"> No notifications yet! </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
