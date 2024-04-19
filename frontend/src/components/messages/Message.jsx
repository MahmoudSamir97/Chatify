import React from "react";

function Message() {
  return (
    <div className={`chat chat-end`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          />
        </div>
      </div>
      <div className={`chat-bubble text-white bg-blue-500  pb-2`}>
        Hi whats app? Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        12:24
      </div>
    </div>
  );
}

export default Message;
