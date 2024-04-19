import React from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import Logout from "./Logout";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      <div className="flex mt-2">
        <Logout />
        <Link to={"/setting"}>
          <CiSettings className="mt-auto ms-2 w-6 h-6 text-white cursor-pointer hover:text-red-500" />
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
