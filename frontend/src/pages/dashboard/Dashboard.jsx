import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'
import Navbar from '../../components/common/Navbar.jsx'
import { DASHBOARD_IMG, EMPTY_IMG } from '../../constants/images.js'
import axios from 'axios'
import DashboardWelcome from './DashboardWelcome.jsx'
import DashboardCards from './DashboardCards.jsx'
import RecentActivity from './RecentActivity.jsx'
import '../../styles/dashboard.css'


const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const token = localStorage.getItem('accessToken')
  const role = localStorage.getItem('userRole')
  const userId = localStorage.getItem('userId')
  const headers = { Authorization: `Bearer ${token}` }
  const api = import.meta.env.VITE_API_URL

  const [stats, setStats] = useState({ gigs: 0, proposals: 0 })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getProfile().then(r => {
      if (r.success) dispatch(setUser(r.user))
    }).catch(() => {})

    fetchStats()
  }, [])

  const fetchStats = async () => {
    fetch(
      'http://localhost:5000/api/v1/proposals/my-proposals',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    )
      .then(r => r.json())
      .then(d => console.log(JSON.stringify(d)))

    setLoading(true)

    try {
      if (role === 'client') {
        // GET /gigs/my-gigs → res.data.data = array of gigs
        const gigsRes = await axios.get(`${api}/gigs/my-gigs`, { headers })
        const gigs = gigsRes.data.data || []
        const activeGigs = gigs.length

        // For each gig, fetch proposals count from /proposals/gig/:gigId
        let totalProposals = 0

        for (const gig of gigs) {
          try {
            const pRes = await axios.get(
              `${api}/proposals/gig/${gig._id}`,
              { headers }
            )

            const pData = pRes.data.data

            totalProposals += Array.isArray(pData)
              ? pData.length
              : (pData?.proposals?.length || 0)
          } catch {}
        }

        setStats({
          gigs: activeGigs,
          proposals: totalProposals
        })

        setActivity(
          gigs.slice(0, 5).map(g => ({
            text: `Gig "${g.title}" is ${g.status}`,
            time: new Date(g.createdAt).toLocaleDateString(),
            icon: '📋'
          }))
        )

      } else {
        // GET /proposals/my-proposals → res.data.data = array of proposals
        const proposalsRes = await axios.get(
          `${api}/proposals/my-proposals`,
          { headers }
        )

        console.log('proposals raw:', JSON.stringify(proposalsRes.data))

        const rawData = proposalsRes.data.data

        const proposals = Array.isArray(rawData)
          ? rawData
          : (rawData?.proposals || [])

        const activeProposals = proposals.filter(
          p => p.status === 'pending' || p.status === 'accepted'
        ).length

        setStats({
          gigs: activeProposals,
          proposals: proposals.length
        })

        setActivity(
          proposals.slice(0, 5).map(p => ({
            text: `Proposal on "${p.gigId?.title || 'a gig'}" is ${p.status}`,
            time: new Date(p.createdAt).toLocaleDateString(),
            icon: '📄'
          }))
        )
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }

    setLoading(false)
  }

  const clientCards = [
    {
      label: 'Active Gigs',
      value: stats.gigs,
      icon: '📋'
    },
    {
      label: 'Proposals Received',
      value: stats.proposals,
      icon: '📨'
    },
  ]

  const freelancerCards = [
    {
      label: 'Active Proposals',
      value: stats.gigs,
      icon: '📄'
    },
    {
      label: 'Total Proposals',
      value: stats.proposals,
      icon: '📨'
    },
  ]

  const cards = role === 'client'
    ? clientCards
    : freelancerCards

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">

        <DashboardWelcome
          user={user}
          dashboardImage={DASHBOARD_IMG}
        />

        <DashboardCards
          cards={cards}
          loading={loading}
        />

        <RecentActivity
          activity={activity}
          loading={loading}
          emptyImage={EMPTY_IMG}
        />

      </div>
    </div>
  )
}

export default Dashboard