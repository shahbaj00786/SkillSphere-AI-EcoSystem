import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import StepIndicator from './createGig/StepIndicator.jsx';
import ProjectDetailsStep from './createGig/ProjectDetailsStep.jsx';
import BudgetTimelineStep from './createGig/BudgetTimelineStep.jsx';
import MilestonesStep from './createGig/MilestonesStep.jsx';
import '../styles/createGig.css';

const CATEGORIES = [
  'web-development',
  'mobile-development',
  'design',
  'writing',
  'marketing',
  'data-science',
  'video-editing',
  'seo',
  'other',
];

const emptyMilestone = {
  name: '',
  description: '',
  amount: '',
  dueDate: '',
};

const CreateGigPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: {
      min: '',
      max: '',
    },
    duration: '',
    requiredSkills: '',
    milestones: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'budgetMin') {
      return setFormData((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          min: value,
        },
      }));
    }

    if (name === 'budgetMax') {
      return setFormData((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          max: value,
        },
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { ...emptyMilestone },
      ],
    }));
  };

  const removeMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index
          ? {
              ...milestone,
              [field]: value,
            }
          : milestone
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,

        budget: {
          min: Number(formData.budget.min),
          max: Number(formData.budget.max),
        },

        requiredSkills: formData.requiredSkills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),

        milestones: formData.milestones.map((milestone) => ({
          ...milestone,
          amount: Number(milestone.amount),
        })),
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/gigs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/gigs');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create gig. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canNext1 =
    formData.title &&
    formData.description &&
    formData.category;

  const canNext2 =
    formData.budget.min &&
    formData.budget.max &&
    formData.duration;

  return (
    <div className="create-gig-page">
      <Navbar />

      <div className="create-gig-container">

        <div className="create-gig-header">
          <h1>Post a New Gig</h1>
          <p>
            Find the perfect freelancer for your project
          </p>
        </div>

        <StepIndicator step={step} />

        <div className="create-gig-card">

          {error && (
            <div className="create-gig-error">
              ❌ {error}
            </div>
          )}

          {step === 1 && (
            <ProjectDetailsStep
              formData={formData}
              handleChange={handleChange}
              categories={CATEGORIES}
              canNext={canNext1}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <BudgetTimelineStep
              formData={formData}
              handleChange={handleChange}
              canNext={canNext2}
              setStep={setStep}
            />
          )}

          {step === 3 && (
            <MilestonesStep
              formData={formData}
              setStep={setStep}
              addMilestone={addMilestone}
              removeMilestone={removeMilestone}
              updateMilestone={updateMilestone}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default CreateGigPage;