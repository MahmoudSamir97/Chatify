import React, { useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessages from "../../hooks/useSendMessages";
import { FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessages();
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef();
  const inputRef = useRef();

  // hide emoji picker when click outside or component unmount
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current.contains(event.target) ||
        (emojiRef.current && emojiRef.current.contains(event.target))
      ) {
        return; // Click occurred inside input field or emoji picker, do nothing
      }
      setShowEmoji(false); // Click occurred outside, close emoji picker
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, emojiRef]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    // prevent sending empty message
    const trimmedMessage = message.trim(); // Trim the message to remove leading and trailing spaces
    if (!trimmedMessage) return;
    await sendMessage(trimmedMessage);
    setMessage("");
  };

  // EMOJI HANDLERS
  const onEmojiClick = (emojiObject, event) => {
    if (!showEmoji) return; // Prevent appending emoji when emoji picker is hidden
    setMessage(message + emojiObject.emoji);
  };
  const handleEmojiBtnClick = (e) => {
    e.preventDefault();
    setShowEmoji(!showEmoji);
  };

  // Prevent the enter key from opening the emoji picker
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {/* Emoji Container  */}
      {showEmoji && (
        <div ref={emojiRef} className={"absolute bottom-14 "}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            emojiStyle="native"
            theme="dark"
            lazyLoadEmojis={false}
            className="!w-[250px] md:!w-[300px] !h-[350px] md:!h-[400px]"
          />
        </div>
      )}
      {/* Emoji Container */}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          className="msg-input border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleEmojiBtnClick}
          className="absolute inset-y-0 start-0 flex items-center ps-2"
        >
          <FaSmile size={20} className="text-yellow-500 hover:text-red-300" />
        </button>
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend className="hover:text-blue-500" />
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
