import React from 'react';
import avatarImg from '../../assets/images/avatar.png';
function UserList({ user, handleFunction }) {
  const userImg = user.profileImage?.secure_url;
  return (
    <div
      role="button"
      onClick={handleFunction}
      className="flex items-center justify-start w-full mb-2 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
    >
      <div className="flex-shrink-0 p-1 mr-1">
        <img
          className="w-9 h-9 rounded-full"
          src={userImg || avatarImg}
          alt="profile"
        />
      </div>
      <div>
        <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700">
          {user.username}
        </h6>
        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
          {user.email}
        </p>
      </div>
    </div>
  );
}

export default UserList;
