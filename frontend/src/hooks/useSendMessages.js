import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

function useSendMessages() {
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const url = `http://localhost:4000/api/message/send/${selectedConversation?._id}`;
      // TOKEN CONFIG (localstorage)
      const token = localStorage.getItem("token").replace(/^"|"$/g, ""); // Remove surrounding quotes
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.post(url, { message }, config);
      if (res.error) throw new Error(res.error);
      setMessages([...messages, res.data]);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
}

export default useSendMessages;