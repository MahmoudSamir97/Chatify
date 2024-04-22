import React, { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import axios from "axios";
import toast from "react-hot-toast";

function useGetMessages() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      try {
        const URL = `http://localhost:4000/api/message/${selectedConversation?._id}`;
        // TOKEN CONFIG (localstorage)
        const token = localStorage.getItem("token").replace(/^"|"$/g, ""); // Remove surrounding quotes
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // TOKEN CONFIG (localstorage)
        const { data } = await axios.get(URL, config);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getMessage();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
}

export default useGetMessages;
