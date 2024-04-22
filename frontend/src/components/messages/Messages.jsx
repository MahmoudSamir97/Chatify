import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSceleton";

function Messages() {
  const { loading, messages } = useGetMessages();
  const lastMsgRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  return (
    <div
      className="px-4 flex-1 overflow-auto"
      style={{
        overflowY: "scroll",
      }}
    >
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMsgRef}>
            <Message message={message} />
          </div>
        ))}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center text text-sm text-gray-400">
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
}

export default Messages;
