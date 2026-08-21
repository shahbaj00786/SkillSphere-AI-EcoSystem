import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Navbar from '../components/common/Navbar.jsx';

import FreelancerProposalCard from './profile/proposals/FreelancerProposalCard.jsx';
import ClientGigList from './profile/proposals/ClientGigList.jsx';
import ProposalReviewCard from './profile/proposals/ProposalReviewCard.jsx';

import '../styles/proposals.css';

const ProposalsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const role = localStorage.getItem('userRole');
  const token = localStorage.getItem('accessToken');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [myProposals, setMyProposals] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigProposals, setGigProposals] = useState([]);
  const [loadingGigProposals, setLoadingGigProposals] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (role === 'freelancer') {
      fetchMyProposals();
    } else {
      fetchMyGigs();
    }
  }, [role]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchMyProposals = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/proposals/my-proposals`,
        { headers }
      );

      setMyProposals(
        res.data.data?.proposals || res.data.data || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const withdrawProposal = async (id) => {
    if (!window.confirm('Withdraw this proposal?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/proposals/${id}`,
        { headers }
      );

      setMyProposals((prev) =>
        prev.filter((p) => p._id !== id)
      );

      showToast('Proposal withdrawn.');
    } catch {
      showToast('Error withdrawing proposal.');
    }
  };

  const fetchMyGigs = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/gigs/my-gigs`,
        { headers }
      );

      setMyGigs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGigProposals = async (gig) => {
    setSelectedGig(gig);
    setLoadingGigProposals(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/proposals/gig/${gig._id}`,
        { headers }
      );

      setGigProposals(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGigProposals(false);
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals/${proposalId}/accept`,
        {},
        { headers }
      );

      setGigProposals((prev) =>
        prev.map((p) =>
          p._id === proposalId
            ? { ...p, status: 'accepted' }
            : {
                ...p,
                status:
                  p.status === 'pending'
                    ? 'rejected'
                    : p.status,
              }
        )
      );

      showToast('✅ Proposal accepted!');
    } catch {
      showToast('Error accepting proposal.');
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals/${proposalId}/reject`,
        {},
        { headers }
      );

      setGigProposals((prev) =>
        prev.map((p) =>
          p._id === proposalId
            ? { ...p, status: 'rejected' }
            : p
        )
      );

      showToast('Proposal rejected.');
    } catch {
      showToast('Error rejecting proposal.');
    }
  };

  return (
    <div className="proposals-page">
      <Navbar />

      {toast && <div className="toast">{toast}</div>}

      <div className="proposals-container">

        {/* FREELANCER VIEW */}
        {role === 'freelancer' && (
          <div>
            <div className="proposals-header">
              <h1>My Proposals</h1>
              <p>
                Track all proposals you've submitted to gigs
              </p>
            </div>

            {loading ? (
              <p className="proposals-loading">
                Loading...
              </p>
            ) : myProposals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>

                <p>
                  You haven't submitted any proposals yet.
                </p>

                <button
                  className="btn-primary"
                  onClick={() =>
                    window.location.href = '/gigs'
                  }
                >
                  Browse Gigs
                </button>
              </div>
            ) : (
              myProposals.map((proposal) => (
                <FreelancerProposalCard
                  key={proposal._id}
                  proposal={proposal}
                  withdrawProposal={withdrawProposal}
                />
              ))
            )}
          </div>
        )}

        {/* CLIENT VIEW */}
        {role !== 'freelancer' && (
          <div>
            <div className="proposals-header">
              <h1>Proposals</h1>
              <p>
                Review proposals submitted to your gigs
              </p>
            </div>

            <div
              className={
                selectedGig ? 'client-grid' : ''
              }
            >
              <ClientGigList
                myGigs={myGigs}
                selectedGig={selectedGig}
                loading={loading}
                fetchGigProposals={fetchGigProposals}
              />

              {selectedGig && (
                <div>
                  <div className="proposals-panel-header">
                    <h3>
                      Proposals for:{' '}
                      <em>{selectedGig.title}</em>
                    </h3>

                    <button
                      className="btn-close"
                      onClick={() =>
                        setSelectedGig(null)
                      }
                    >
                      ✕
                    </button>
                  </div>

                  {loadingGigProposals ? (
                    <p className="proposals-panel-loading">
                      Loading...
                    </p>
                  ) : gigProposals.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>

                      <p>
                        No proposals received yet.
                      </p>
                    </div>
                  ) : (
                    gigProposals.map((proposal) => (
                      <ProposalReviewCard
                        key={proposal._id}
                        proposal={proposal}
                        selectedGig={selectedGig}
                        handleAccept={handleAccept}
                        handleReject={handleReject}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProposalsPage;