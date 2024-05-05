import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import notificationSound from '../assets/sounds/notification.mp3';
import { useFetchContext } from '../context/FetchContext';

function useListenMessage() {
  const { socket } = useSocketContext();
  const { setMessages, messages, selectedConversation } = useConversation();
  const { notifications, setNotifications } = useFetchContext();
  const selectedCompareChat = selectedConversation;

  console.log(notifications, 'notifications');
  console.log(selectedCompareChat, 'selectedCompareChat');

  useEffect(() => {
    if (!socket) return;
    const handleMessageReceived = (newMessage) => {
      console.log(newMessage, 'message received 😎😎😎😎😎');
      console.log(selectedCompareChat);
      if (
        !selectedCompareChat ||
        newMessage.chat._id !== selectedConversation?._id
      ) {
        if (!notifications.includes(newMessage)) {
          setNotifications([newMessage, ...notifications]);
        }
      } else {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, newMessage]);
      }
    };
    socket.on('message received', handleMessageReceived);

    return () => socket.off('message received', handleMessageReceived);
  }, [socket, setMessages, messages]);
}

export default useListenMessage;

//   useEffect(() => {
//     socket?.on('message received', (newMessage) => {
//       if (
//         !selectedConversation ||
//         newMessage.chat._id !== selectedConversation._id
//       ) {
//         if (!notifications.includes(newMessage)) {
//           setNotifications([newMessage, ...notifications]);
//         }
//       } else {
//         newMessage.shouldShake = true;
//         const sound = new Audio(notificationSound);
//         sound.play();
//         setMessages([...messages, newMessage]);
//       }
//     });
//     return () => socket?.off('message received');
//   }, [socket, setMessages, messages]);
// }
