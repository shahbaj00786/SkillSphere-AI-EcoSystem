import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import '../styles/chat.css';
import Navbar from '../components/common/Navbar.jsx';
import ConversationList from './chat/ConversationList.jsx';
import ChatWindow from './chat/ChatWindow.jsx';

const ChatPage = () => {
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!userId || !token) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    // Join current user's room
    socket.emit('join-room', userId);

    // Receive message from another user
    socket.on('receive-message', (message) => {
      const senderId =
        message.senderId?._id ||
        message.senderId;

      const receiverId =
        message.receiverId?._id ||
        message.receiverId;

      const isCurrentConversation =
        senderId?.toString() ===
          activeConversation?._id?.toString() ||
        receiverId?.toString() ===
          activeConversation?._id?.toString();

      if (isCurrentConversation) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) =>
              msg._id?.toString() ===
              message._id?.toString()
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, message];
        });
      }

      // Refresh conversation list
      fetchConversations();
    });

    socket.on('user-typing', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-typing');
      socket.disconnect();
    };
  }, [userId, token]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 50);
  };

  const fetchConversations = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const convs = response.data?.data || [];

      setConversations(convs);

      // Open conversation from URL
      const params = new URLSearchParams(
        location.search
      );

      const receiverId = params.get('receiverId');
      const receiverName =
        params.get('name') || 'User';

      if (receiverId) {
        const existing = convs.find(
          (conversation) =>
            conversation._id?.toString() ===
            receiverId.toString()
        );

        if (existing) {
          setActiveConversation(existing);
        } else {
          const newConversation = {
            _id: receiverId,
            user: [
              {
                _id: receiverId,
                name: receiverName,
              },
            ],
          };

          setActiveConversation(newConversation);
        }

        await fetchMessages(receiverId);
      }
    } catch (error) {
      console.error(
        'Error fetching conversations:',
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    if (!otherUserId || !token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/conversation/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data?.data || []);

      scrollToBottom();
    } catch (error) {
      console.error(
        'Error fetching messages:',
        error.response?.data || error
      );

      setMessages([]);
    }
  };

  const selectConversation = async (conversation) => {
    const otherUserId = conversation._id;

    setActiveConversation(conversation);
    setMessages([]);

    await fetchMessages(otherUserId);
  };

  const handleTyping = () => {
    if (!activeConversation || !socketRef.current) {
      return;
    }

    socketRef.current.emit('typing', {
      senderId: userId,
      receiverId: activeConversation._id,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop-typing', {
        senderId: userId,
        receiverId: activeConversation._id,
      });
    }, 3000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (
      !messageInput.trim() ||
      !activeConversation
    ) {
      return;
    }

    const content = messageInput.trim();

    const receiverId =
      activeConversation._id;

    setMessageInput('');

    try {
      // Save message ONLY through HTTP
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/send`,
        {
          receiverId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedMessage =
        response.data?.data;

      // Add saved message to sender's UI
      if (savedMessage) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) =>
              msg._id?.toString() ===
              savedMessage._id?.toString()
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, savedMessage];
        });
      }

      scrollToBottom();

      // Stop typing
      socketRef.current?.emit(
        'stop-typing',
        {
          senderId: userId,
          receiverId,
        }
      );

      // Refresh conversations
      fetchConversations();
    } catch (error) {
      console.error(
        'Error sending message:',
        error.response?.data || error
      );

      // Restore input if sending fails
      setMessageInput(content);
    }
  };

  return (
    <div className="chat-page">
      <Navbar />

      <div className="chat-container">
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          selectConversation={selectConversation}
          loading={loading}
        />

        <ChatWindow
          activeConversation={activeConversation}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleTyping={handleTyping}
          sendMessage={sendMessage}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
};

export default ChatPage;