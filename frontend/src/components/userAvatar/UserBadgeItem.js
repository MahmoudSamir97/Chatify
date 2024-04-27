import React from "react";
import avatarImg from "../../assets/images/avatar.png";

const UserBadgeItem = ({ user, handleDelete, admin }) => {
  return (
    <div className="inline-flex text-xs items-center bg-purple-700 text-white px-2 py-1 rounded-lg m-1 mb-2 cursor-pointer">
      <span className="mr-1">{user.username}</span>
      {admin === user._id && <span className="text-xs">(Admin)</span>}
      <button onClick={handleDelete} className="ml-1 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 16.6a7.6 7.6 0 110-15.2 7.6 7.6 0 010 15.2zm.707-8.596l2.121-2.121a.75.75 0 10-1.06-1.06L10 9.94 7.232 7.172a.75.75 0 00-1.06 1.06L8.94 10l-2.768 2.768a.75.75 0 101.06 1.06L10 11.06l2.768 2.768a.75.75 0 101.06-1.06L11.06 10l2.768-2.768a.75.75 0 00-1.06-1.06L10 8.94z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default UserBadgeItem;
