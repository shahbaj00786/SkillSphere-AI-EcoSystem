import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

import SetupStepIndicator from './freelancerSetup/SetupStepIndicator.jsx';
import BasicInfoStep from './freelancerSetup/BasicInfoStep.jsx';
import SkillsStep from './freelancerSetup/SkillsStep.jsx';
import PortfolioStep from './freelancerSetup/PortfolioStep.jsx';
import ExperienceStep from './freelancerSetup/ExperienceStep.jsx';

import '../styles/freelancerSetup.css';

const SKILL_LEVELS = ['beginner', 'intermediate', 'expert'];
const PRICING_TYPES = ['hourly', 'milestone', 'both'];

const FreelancerSetupPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
    pricingType: 'hourly',
    location: {
      city: '',
      state: '',
      country: '',
    },
    skills: [
      {
        name: '',
        proficiencyLevel: 'intermediate',
      },
    ],
    portfolioItems: [],
    workExperience: [],
    certifications: [],
  });

  // ================= BASIC INFO =================

  const updateBasicInfo = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateLocation = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  // ================= SKILLS =================

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: '',
          proficiencyLevel: 'intermediate',
        },
      ],
    }));
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index
          ? {
              ...skill,
              [field]: value,
            }
          : skill
      ),
    }));
  };

  // ================= PORTFOLIO =================

  const addPortfolio = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioItems: [
        ...prev.portfolioItems,
        {
          title: '',
          url: '',
          description: '',
        },
      ],
    }));
  };

  const removePortfolio = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updatePortfolio = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  // ================= EXPERIENCE =================

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: '',
          role: '',
          from: '',
          to: '',
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateExperience = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map(
        (experience, i) =>
          i === index
            ? {
                ...experience,
                [field]: value,
              }
            : experience
      ),
    }));
  };

  // ================= CERTIFICATIONS =================

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: '',
          issuer: '',
          year: '',
        },
      ],
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications:
        prev.certifications.filter(
          (_, i) => i !== index
        ),
    }));
  };

  const updateCertification = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      certifications:
        prev.certifications.map(
          (certification, i) =>
            i === index
              ? {
                  ...certification,
                  [field]: value,
                }
              : certification
        ),
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,

        hourlyRate: Number(
          formData.hourlyRate
        ),

        skills: formData.skills.filter(
          (skill) => skill.name.trim()
        ),

        portfolioItems:
          formData.portfolioItems.filter(
            (item) => item.title.trim()
          ),

        workExperience:
          formData.workExperience.filter(
            (experience) =>
              experience.company.trim()
          ),

        certifications:
          formData.certifications.filter(
            (certification) =>
              certification.name.trim()
          ),
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/freelancers/setup`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/profile');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Setup failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canNext1 =
    formData.bio.trim() &&
    formData.hourlyRate &&
    formData.location.country;

  const canNext2 = formData.skills.some(
    (skill) => skill.name.trim()
  );

  const steps = [
    'Basic Info',
    'Skills',
    'Portfolio',
    'Experience',
  ];

  return (
    <div className="freelancer-setup-page">
      <Navbar />

      <div className="freelancer-setup-container">

        <div className="setup-header">
          <h1>
            Set Up Your Freelancer Profile
          </h1>

          <p>
            Complete your profile to start
            receiving gig matches
          </p>
        </div>

        <SetupStepIndicator
          step={step}
          steps={steps}
        />

        <div className="setup-card">

          {error && (
            <div className="setup-error">
              ❌ {error}
            </div>
          )}

          {step === 1 && (
            <BasicInfoStep
              formData={formData}
              updateBasicInfo={updateBasicInfo}
              updateLocation={updateLocation}
              pricingTypes={PRICING_TYPES}
              canNext={canNext1}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <SkillsStep
              skills={formData.skills}
              skillLevels={SKILL_LEVELS}
              addSkill={addSkill}
              removeSkill={removeSkill}
              updateSkill={updateSkill}
              canNext={canNext2}
              setStep={setStep}
            />
          )}

          {step === 3 && (
            <PortfolioStep
              portfolioItems={
                formData.portfolioItems
              }
              addPortfolio={addPortfolio}
              removePortfolio={removePortfolio}
              updatePortfolio={updatePortfolio}
              setStep={setStep}
            />
          )}

          {step === 4 && (
            <ExperienceStep
              workExperience={
                formData.workExperience
              }
              certifications={
                formData.certifications
              }
              addExperience={addExperience}
              removeExperience={
                removeExperience
              }
              updateExperience={
                updateExperience
              }
              addCertification={
                addCertification
              }
              removeCertification={
                removeCertification
              }
              updateCertification={
                updateCertification
              }
              setStep={setStep}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default FreelancerSetupPage;