import React from "react";
import avatarImg from "../../assets/images/avatar.png";
function UserList({ user, handleFunction }) {
  const userImg = user?.profileImg?.secure_url;
  return (
    <div className="relative flex flex-col   text-gray-700 mb-2 bg-gray-200  rounded-xl ">
      <nav className="flex  flex-col gap-1 p-1 font-sans text-base font-normal text-blue-gray-700">
        <div
          role="button"
          onClick={handleFunction}
          className="flex items-center leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-gray-900 focus:bg-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <div className="flex-shrink-0 mr-2">
            <img
              className="w-9 h-9 rounded-full"
              src={userImg || avatarImg}
              alt="profile"
            />
          </div>
          <div>
            <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
              {user.username}
            </h6>
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
              {user.email}
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default UserList;
