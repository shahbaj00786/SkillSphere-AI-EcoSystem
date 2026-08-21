import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar.jsx";

import GigHeader from "./gigDetail/GigHeader.jsx";
import GigOverview from "./gigDetail/GigOverview.jsx";
import GigSkills from "./gigDetail/GigSkills.jsx";
import GigMilestones from "./gigDetail/GigMilestones.jsx";
import GigSidebar from "./gigDetail/GigSidebar.jsx";
import ProposalForm from "./gigDetail/ProposalForm.jsx";

import "../styles/gigDetail.css";

const GigDetail = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    bidAmount: "",
    estimatedDays: "",
  });

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("accessToken");

  // ==============================
  // FETCH GIG
  // ==============================

  useEffect(() => {
    if (gigId) {
      fetchGigDetails();
    }
  }, [gigId]);

  const fetchGigDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gigs/${gigId}`
      );

      setGig(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching gig:", error);
      setGig(null);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // PROPOSAL INPUT
  // ==============================

  const handleProposalChange = (e) => {
    const { name, value } = e.target;

    setProposal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // SUBMIT PROPOSAL
  // ==============================

  const submitProposal = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!proposal.title.trim()) {
      alert("Please enter proposal title.");
      return;
    }

    if (!proposal.description.trim()) {
      alert("Please enter your proposal.");
      return;
    }

    if (!proposal.bidAmount || Number(proposal.bidAmount) <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    if (
      !proposal.estimatedDays ||
      Number(proposal.estimatedDays) <= 0
    ) {
      alert("Please enter estimated completion days.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals`,
        {
          gigId,
          title: proposal.title.trim(),
          description: proposal.description.trim(),
          bidAmount: Number(proposal.bidAmount),
          estimatedDays: Number(proposal.estimatedDays),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Proposal submitted successfully!");

      setShowProposalForm(false);

      setProposal({
        title: "",
        description: "",
        bidAmount: "",
        estimatedDays: "",
      });

      // Refresh gig data
      fetchGigDetails();
    } catch (error) {
      console.error("Proposal submission error:", error);

      alert(
        error.response?.data?.message ||
          "Error submitting proposal"
      );
    }
  };

  // ==============================
  // MESSAGE CLIENT
  // ==============================

  const messageClient = () => {
    const clientId =
      gig?.clientId?._id ||
      gig?.clientId?.id;

    if (!clientId) {
      alert("Client information unavailable.");
      return;
    }

    const clientName =
      gig?.clientId?.name || "Client";

    navigate(
      `/chat?receiverId=${clientId}&name=${encodeURIComponent(
        clientName
      )}`
    );
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="gig-detail-page">
        <Navbar />

        <div className="gig-detail-loading">
          <div className="loading-spinner"></div>

          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // NOT FOUND
  // ==============================

  if (!gig) {
    return (
      <div className="gig-detail-page">
        <Navbar />

        <div className="gig-detail-error">
          <h2>Gig not found</h2>

          <button
            type="button"
            onClick={() => navigate("/gigs")}
          >
            ← Back to Gigs
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="gig-detail-page">
      <Navbar />

      <main className="gig-detail-wrapper">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="gig-back-btn"
          onClick={() => navigate("/gigs")}
        >
          ← Back to Gigs
        </button>

        {/* HEADER */}

        <GigHeader gig={gig} />

        {/* MAIN CONTENT */}

        <div className="gig-detail-layout">

          {/* LEFT SIDE */}

          <section className="gig-detail-main">

            <GigOverview
              description={gig.description}
            />

            <GigSkills
              skills={gig.requiredSkills || []}
            />

            <GigMilestones
              milestones={gig.milestones || []}
            />

          </section>

          {/* RIGHT SIDE */}

          <GigSidebar
            gig={gig}
            userRole={userRole}
            onMessageClient={messageClient}
            onSubmitProposal={() =>
              setShowProposalForm(true)
            }
          />

        </div>

      </main>

      {/* PROPOSAL MODAL */}

      {showProposalForm && (
        <ProposalForm
          proposal={proposal}
          onChange={handleProposalChange}
          onSubmit={submitProposal}
          onCancel={() =>
            setShowProposalForm(false)
          }
        />
      )}
    </div>
  );
};

export default GigDetail;