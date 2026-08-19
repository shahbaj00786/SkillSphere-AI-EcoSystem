import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/adminDashboard.css'
import Navbar from '../components/common/Navbar.jsx'
import AdminStats from './admin/AdminStats.jsx'
import UserManagement from './admin/UserManagement.jsx'
import ActivityLogs from './admin/ActivityLogs.jsx'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [suspendReason, setSuspendReason] = useState('')

  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
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
      ])

      setStats(statsRes.data.data)
      setUsers(usersRes.data.data)
      setLogs(logsRes.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      alert('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const suspendUser = async (userId) => {
    if (!suspendReason.trim()) {
      alert('Please provide a reason for suspension')
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/suspend`,
        { reason: suspendReason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('User suspended successfully')
      setSuspendReason('')
      setSelectedUser(null)
      fetchDashboardData()
    } catch (error) {
      alert('Error suspending user')
      console.error(error)
    }
  }

  const activateUser = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('User activated successfully')
      fetchDashboardData()
    } catch (error) {
      alert('Error activating user')
      console.error(error)
    }
  }

  const verifyFreelancer = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/freelancers/${userId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Freelancer verified successfully')
      fetchDashboardData()
    } catch (error) {
      alert('Error verifying freelancer')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>
  }

  return (
    <div>
      <Navbar />

      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

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

        {activeTab === 'stats' && stats && (
          <AdminStats stats={stats} />
        )}

        {activeTab === 'users' && (
          <UserManagement
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            suspendReason={suspendReason}
            setSuspendReason={setSuspendReason}
            suspendUser={suspendUser}
            activateUser={activateUser}
            verifyFreelancer={verifyFreelancer}
          />
        )}

        {activeTab === 'logs' && (
          <ActivityLogs logs={logs} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard