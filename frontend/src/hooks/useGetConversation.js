import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function useGetConversation() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        // TOKEN CONFIG (localstorage)

        const url = "http://localhost:4000/api/user/conversations";
        const token = localStorage.getItem("token").replace(/^"|"$/g, ""); // Remove surrounding quotes
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get(url, config);

        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  return { loading, conversations, setConversations };
}

export default useGetConversation;
