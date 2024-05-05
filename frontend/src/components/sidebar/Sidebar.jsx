import React, { useState } from 'react';
import Conversations from './Conversations';
import Menu from './Menu';
import SearchUser from './SearchUser';

function Sidebar() {
  const [showSearchSidebar, setshowSearchSidebar] = useState(false);
  const toggleSearchSidebar = () => {
    setshowSearchSidebar(!showSearchSidebar);
  };
  console.log('Sidebar');
  return (
    <div className="flex w-full justify-between py-2">
      {showSearchSidebar && <SearchUser />}
      <Menu toggleSidebar={toggleSearchSidebar} />
      <div className="border-r border-slate-500 p-4 flex flex-col">
        <Conversations />
      </div>
    </div>
  );
}

export default Sidebar;
