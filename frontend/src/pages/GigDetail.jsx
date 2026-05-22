import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/gigDetail.css';

const GigDetail = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposal, setProposal] = useState({
    title: '',
    description: '',
    bidAmount: '',
    estimatedDays: '',
  });

  useEffect(() => {
    fetchGigDetails();
  }, [gigId]);

  const fetchGigDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gigs/${gigId}`
      );
      setGig(response.data.data);
    } catch (error) {
      console.error('Error fetching gig:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalChange = (e) => {
    const { name, value } = e.target;
    setProposal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals`,
        {
          gigId,
          ...proposal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Proposal submitted successfully!');
      setShowProposalForm(false);
      setProposal({ title: '', description: '', bidAmount: '', estimatedDays: '' });
    } catch (error) {
      alert('Error submitting proposal');
      console.error(error);
    }
  };

  if (loading) return <div className="loading">Loading gig details...</div>;
  if (!gig) return <div className="error">Gig not found</div>;

  return (
    <div className="gig-detail">
      <div className="gig-detail-header">
        <h1>{gig.title}</h1>
        <div className="gig-meta">
          <span className="category">{gig.category}</span>
          <span className="status">{gig.status}</span>
        </div>
      </div>

      <div className="gig-detail-content">
        <div className="gig-main">
          <div className="gig-description-section">
            <h2>Description</h2>
            <p>{gig.description}</p>
          </div>

          <div className="gig-skills">
            <h3>Required Skills</h3>
            <div className="skills-list">
              {gig.requiredSkills?.map((skill, idx) => (
                <span key={idx} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="gig-milestones">
            <h3>Milestones</h3>
            {gig.milestones?.map((milestone, idx) => (
              <div key={idx} className="milestone">
                <p className="milestone-name">{milestone.name}</p>
                <p className="milestone-amount">${milestone.amount}</p>
                <p className="milestone-date">{new Date(milestone.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="gig-sidebar">
          <div className="budget-card">
            <h3>Budget</h3>
            <p className="budget-range">
              ${gig.budget.min} - ${gig.budget.max}
            </p>
            <p className="duration">{gig.duration}</p>
          </div>

          <div className="client-card">
            <h3>Client Info</h3>
            <p className="client-name">{gig.clientId?.name}</p>
            <p className="client-email">{gig.clientId?.email}</p>
          </div>

          {!showProposalForm ? (
            <button
              className="btn-submit-proposal"
              onClick={() => setShowProposalForm(true)}
            >
              Submit a Proposal
            </button>
          ) : (
            <form className="proposal-form" onSubmit={submitProposal}>
              <h3>Your Proposal</h3>
              <input
                type="text"
                name="title"
                placeholder="Proposal Title"
                value={proposal.title}
                onChange={handleProposalChange}
                required
              />
              <textarea
                name="description"
                placeholder="Describe your approach..."
                value={proposal.description}
                onChange={handleProposalChange}
                required
              />
              <input
                type="number"
                name="bidAmount"
                placeholder="Bid Amount"
                value={proposal.bidAmount}
                onChange={handleProposalChange}
                required
              />
              <input
                type="number"
                name="estimatedDays"
                placeholder="Estimated Days"
                value={proposal.estimatedDays}
                onChange={handleProposalChange}
                required
              />
              <button type="submit" className="btn-submit">
                Submit Proposal
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowProposalForm(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetail;