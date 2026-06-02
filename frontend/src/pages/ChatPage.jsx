import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import '../styles/chat.css';
import Navbar from '../components/common/Navbar.jsx';

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
    // Initialize Socket.IO connection
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socketRef.current.emit('join-room', userId);

    socketRef.current.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socketRef.current.on('user-typing', (data) => {
      setIsTyping(data.isTyping);
    });

    fetchConversations();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/conversations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const convs = response.data.data;
      setConversations(convs);

      // Auto-open conversation from URL param
      const params = new URLSearchParams(location.search);
      const receiverId = params.get('receiverId');
      const receiverName = params.get('name') || 'User';
      if (receiverId) {
        const existing = convs.find(c => c._id === receiverId);
        if (existing) {
          setActiveConversation(existing);
          fetchMessages(existing._id);
        } else {
          const newConv = { _id: receiverId, user: [{ name: receiverName }] };
          setActiveConversation(newConv);
          fetchMessages(receiverId);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/conversation/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    fetchMessages(conversation._id);
  };

  const handleTyping = () => {
    if (activeConversation) {
      socketRef.current.emit('typing', {
        senderId: userId,
        receiverId: activeConversation._id,
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('stop-typing', {
          senderId: userId,
          receiverId: activeConversation._id,
        });
      }, 3000);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Optimistic UI update
    const optimisticMsg = {
      _id: Date.now(),
      senderId: userId,
      receiverId: activeConversation._id,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      // Save via HTTP API
      await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/send`,
        { receiverId: activeConversation._id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Also emit via socket for real-time delivery to receiver
      if (socketRef.current) {
        socketRef.current.emit('send-message', {
          senderId: userId,
          receiverId: activeConversation._id,
          content,
          senderName: localStorage.getItem('userName'),
        });
        socketRef.current.emit('stop-typing', {
          senderId: userId,
          receiverId: activeConversation._id,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <Navbar />
    <div className="chat-container">
      
      <div className="chat-sidebar">
        <h2>Messages</h2>
        {loading ? (
          <p className="loading">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <p className="no-conversations">No conversations yet</p>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${
                  activeConversation?._id === conv._id ? 'active' : ''
                }`}
                onClick={() => selectConversation(conv)}
              >
                {conv.user[0]?.avatar
                  ? <img src={conv.user[0].avatar} alt="avatar" onError={(e) => { e.target.style.display='none'; }} />
                  : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>{conv.user[0]?.name?.charAt(0).toUpperCase() || '?'}</div>
                }
                <div className="conv-info">
                  <p className="conv-name">{conv.user[0]?.name}</p>
                  <p className="last-message">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-main">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <h3>{activeConversation.user[0]?.name}</h3>
              <p className="chat-status">Active now</p>
            </div>

            <div className="messages-container">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    (msg.senderId?._id || msg.senderId)?.toString() === userId ? 'sent' : 'received'
                  }`}
                >
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                className="message-input"
              />
              <button type="submit" className="send-btn">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ChatPage;