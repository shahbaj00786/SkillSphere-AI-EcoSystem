import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminDashboard.css';
import Navbar from '../components/common/Navbar.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setLogs(logsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId) => {
    if (!suspendReason.trim()) {
      alert('Please provide a reason for suspension');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/suspend`,
        { reason: suspendReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User suspended successfully');
      setSuspendReason('');
      setSelectedUser(null);
      fetchDashboardData();
    } catch (error) {
      alert('Error suspending user');
      console.error(error);
    }
  };

  const activateUser = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User activated successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Error activating user');
      console.error(error);
    }
  };

  const verifyFreelancer = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/freelancers/${userId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Freelancer verified successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Error verifying freelancer');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div>
      <Navbar/>
    <div className="admin-dashboard">
      <Navbar/>
      <h1>Admin Dashboard</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Activity Logs
        </button>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-box">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <p className="stat-detail">Active: {stats.activeUsers}</p>
            </div>
            <div className="stat-box">
              <h3>Suspended Users</h3>
              <p className="stat-number">{stats.suspendedUsers}</p>
              <p className="stat-detail">Inactive accounts</p>
            </div>
            <div className="stat-box">
              <h3>Total Gigs</h3>
              <p className="stat-number">{stats.totalGigs}</p>
              <p className="stat-detail">Active projects</p>
            </div>
            <div className="stat-box">
              <h3>Completed Payments</h3>
              <p className="stat-number">{stats.totalPayments}</p>
              <p className="stat-detail">Revenue: ${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Manage Users</h2>
          {selectedUser ? (
            <div className="user-detail-modal">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setSelectedUser(null)}>
                  ×
                </button>
                <h3>Manage User: {selectedUser.name}</h3>
                <p>Email: {selectedUser.email}</p>
                <p>Status: {selectedUser.isSuspended ? 'Suspended' : 'Active'}</p>

                {selectedUser.isSuspended ? (
                  <button
                    className="btn-activate"
                    onClick={() => activateUser(selectedUser._id)}
                  >
                    Activate User
                  </button>
                ) : (
                  <div className="suspend-form">
                    <textarea
                      placeholder="Reason for suspension..."
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      rows="3"
                    />
                    <button
                      className="btn-suspend"
                      onClick={() => suspendUser(selectedUser._id)}
                    >
                      Suspend User
                    </button>
                  </div>
                )}

                {!selectedUser.isVerified && (
                  <button
                    className="btn-verify"
                    onClick={() => verifyFreelancer(selectedUser._id)}
                  >
                    Verify as Freelancer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status ${user.isSuspended ? 'suspended' : 'active'}`}>
                        {user.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td>{user.isVerified ? '✓' : '✗'}</td>
                    <td>
                      <button
                        className="btn-manage"
                        onClick={() => setSelectedUser(user)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'logs' && (
        <div className="logs-section">
          <h2>Admin Activity Logs</h2>
          <div className="logs-table">
            <table>
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.adminId?.name || 'Unknown'}</td>
                    <td>
                      <span className={`action-badge ${log.action}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{log.targetModel}</td>
                    <td>{log.description || '-'}</td>
                    <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminDashboard;