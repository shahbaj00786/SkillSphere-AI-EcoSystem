import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const routes = {
  proposal_received: '/proposals',
  proposal_accepted: '/proposals',
  message: '/messages',
  review_added: '/reviews',
  payment_received: '/payments',
  gig_posted: '/gigs',
};

const icons = {
  gig_posted: '📋',
  proposal_received: '📧',
  proposal_accepted: '✅',
  message: '💬',
  payment_received: '💰',
  review_added: '⭐',
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchNotifications();
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${api}/notifications?limit=10`, { headers });
      setNotifications(res.data.data.notifications || []);
      setUnreadCount(res.data.data.unreadCount || 0);
    } catch {}
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await axios.put(`${api}/notifications/${notif._id}/read`, {}, { headers });
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch {}
    }
    setShowDropdown(false);
    const path = routes[notif.type];
    if (path) navigate(path);
  };

  const deleteNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${api}/notifications/${id}`, { headers });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${api}/notifications/read-all`, {}, { headers });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button onClick={() => { setShowDropdown(!showDropdown); fetchNotifications(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '4px' }}>
        <span style={{ fontSize: '22px' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-4px',
            background: '#ef4444', color: 'white', borderRadius: '50%',
            fontSize: '11px', fontWeight: '700', minWidth: '18px', height: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px'
          }}>{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute', right: 0, top: '40px', width: '320px',
          background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 1000, overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#111827' }}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', margin: 0 }}>No notifications</p>
            ) : (
              notifications.map(n => (
                <div key={n._id} onClick={() => handleClick(n)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '12px 16px', cursor: 'pointer',
                    background: n.isRead ? 'white' : '#eef2ff',
                    borderBottom: '1px solid #f9fafb',
                    borderLeft: n.isRead ? '3px solid transparent' : '3px solid #4f46e5',
                  }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{icons[n.type] || '🔔'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: n.isRead ? '500' : '700', color: '#111827' }}>{n.title}</p>
                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.message}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{new Date(n.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <button onClick={(e) => deleteNotif(e, n._id)}
                    style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>×</button>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
            <span onClick={() => { setShowDropdown(false); navigate('/notifications'); }}
              style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              View All Notifications
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;