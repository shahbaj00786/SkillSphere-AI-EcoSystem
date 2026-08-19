import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar.jsx'
import MatchBadge from './aiMatch/MatchBadge.jsx'
import AIMatchHeader from './aiMatch/AIMatchHeader.jsx'
import AISummary from './aiMatch/AISummary.jsx'
import ProfileMissing from './aiMatch/ProfileMissing.jsx'
import MatchError from './aiMatch/MatchError.jsx'
import MatchSort from './aiMatch/MatchSort.jsx'
import MatchLoading from './aiMatch/MatchLoading.jsx'
import NoMatches from './aiMatch/NoMatches.jsx'
import MatchCard from './aiMatch/MatchCard.jsx'
import TrendingSkills from './aiMatch/TrendingSkills.jsx'
import QuickActions from './aiMatch/QuickActions.jsx'
import '../styles/aiMatch.css'

const AIMatchPage = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const [matches, setMatches] = useState([])
  const [summary, setSummary] = useState('')
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatedProposal, setGeneratedProposal] = useState(null)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('score')
  const [profileMissing, setProfileMissing] = useState(false)

  useEffect(() => {
    fetchMatches()
    fetchTrending()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ai/match-gigs`,
        { headers }
      )

      const data = res.data.data
      setMatches(data.matches || [])
      setSummary(data.summary || '')
    } catch (err) {
      if (
        err.response?.status === 404 ||
        err.response?.data?.message?.includes('profile')
      ) {
        setProfileMissing(true)
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load AI matches. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchTrending = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ai/trending-skills`
      )

      setTrending(res.data.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  const generateProposal = async (gigId) => {
    setGeneratedProposal(null)

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ai/generate-proposal/${gigId}`,
        { headers }
      )

      setGeneratedProposal({
        gigId,
        ...res.data.data
      })
    } catch (err) {
  console.error('Generate proposal error:', err)
  console.error('Response:', err.response?.data)
  console.error('Status:', err.response?.status)

  alert(
    err.response?.data?.message ||
    'Failed to generate proposal. Please try again.'
  )
}
  }

  const sorted = [...matches].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score
    if (sortBy === 'budget') {
      return (b.gig?.budget?.max || 0) - (a.gig?.budget?.max || 0)
    }

    return new Date(b.gig?.createdAt) - new Date(a.gig?.createdAt)
  })

  return (
    <div className="ai-match-page">
      <Navbar />

      <div className="ai-match-layout">

        <div className="ai-match-main">

          <AIMatchHeader />

          {summary && (
            <AISummary summary={summary} />
          )}

          {profileMissing && (
            <ProfileMissing navigate={navigate} />
          )}

          {error && !profileMissing && (
            <MatchError
              error={error}
              fetchMatches={fetchMatches}
            />
          )}

          {!loading && !profileMissing && matches.length > 0 && (
            <MatchSort
              matches={matches}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}

          {loading && (
            <MatchLoading />
          )}

          {!loading &&
            !profileMissing &&
            !error &&
            matches.length === 0 && (
              <NoMatches />
            )}

          {sorted.map((m) => {
            const gig = m.gig

            if (!gig) return null

            return (
              <MatchCard
                key={gig._id}
                match={m}
                gig={gig}
                navigate={navigate}
                generateProposal={generateProposal}
                generatedProposal={generatedProposal}
                setGeneratedProposal={setGeneratedProposal}
              />
            )
          })}
        </div>

        <div className="ai-match-sidebar">

          <TrendingSkills trending={trending} />

          <QuickActions navigate={navigate} />

        </div>
      </div>
    </div>
  )
}

export default AIMatchPage