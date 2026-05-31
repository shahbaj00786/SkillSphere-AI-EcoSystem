import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, { headers });
      setNotifications(res.data.data?.notifications || res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notifications/mark-all-read`, {}, { headers });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, { headers });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const deleteNotif = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/notifications/${id}`, { headers });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (e) { console.error(e); }
  };

  const iconMap = {
    proposal: '📄', payment: '💰', review: '⭐',
    message: '💬', gig: '💼', dispute: '⚖️', system: '🔔',
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '26px', color: '#111827' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ marginLeft: '10px', background: '#4f46e5', color: 'white', fontSize: '13px', fontWeight: '700', padding: '2px 10px', borderRadius: '12px' }}>
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>All your activity updates</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#4f46e5', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px' }}>Loading...</p>
        ) : notifications.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '36px', margin: '0 0 12px' }}>🔔</p>
            <p style={{ color: '#6b7280' }}>No notifications yet.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n._id} onClick={() => markRead(n._id)} style={{
              background: n.isRead ? 'white' : '#eef2ff',
              borderRadius: '12px', padding: '16px 20px', marginBottom: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)', cursor: 'pointer',
              borderLeft: n.isRead ? '4px solid transparent' : '4px solid #4f46e5',
              display: 'flex', gap: '14px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{iconMap[n.type] || '🔔'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: n.isRead ? '500' : '700', color: '#111827', fontSize: '14px' }}>{n.title}</p>
                <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: '13px' }}>{n.message}</p>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteNotif(n._id); }}
                style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '18px', flexShrink: 0, padding: '0 4px' }}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;