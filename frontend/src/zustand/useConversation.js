import { create } from 'zustand';

const useConversation = create((set) => ({
  selectedConversation: null,

  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),

  typing: false,
  setTyping: (isTyping) => set({ typing: isTyping }),
}));

export default useConversation;

// messages: [],
