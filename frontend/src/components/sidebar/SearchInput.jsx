import React from "react";
import { IoSearchSharp } from "react-icons/io5";

function SearchInput() {
  return (
    <form className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered rounded-full text-white bg-gray-900"
      />
      <button
        type="submit"
        className="btn btn-circle bg-gray-800 hover:bg-slate-500 text-white border-none"
      >
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
}

export default SearchInput;
