import React from "react";
import Conversation from "./Conversation";
import useGetConversation from "../../hooks/useGetConversation";

function Conversations() {
  const { loading, conversations } = useGetConversation();
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conv, idx) => (
        <Conversation
          key={conv._id}
          conversation={conv}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
}

export default Conversations;
