import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function useGetConversation() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  const getConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token").replace(/^"|"$/g, ""); // Remove surrounding quotes
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const {
        data: { populatedChats },
      } = await axios.get("/chat", config);
      setConversations(populatedChats);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  return { loading, conversations, setConversations, getConversations };
}

export default useGetConversation;
