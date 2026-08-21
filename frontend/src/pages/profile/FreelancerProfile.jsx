import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar.jsx';
import ProfileHeader from './freelancerProfile/ProfileHeader.jsx';
import ProfileBio from './freelancerProfile/ProfileBio.jsx';
import ProfileSkills from './freelancerProfile/ProfileSkills.jsx';
import ProfilePortfolio from './freelancerProfile/ProfilePortfolio.jsx';
import '../../styles/freelancerProfile.css';

const FreelancerProfile = () => {
  const { id } = useParams();

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancerData();
  }, [id]);

  const fetchFreelancerData = async () => {
    try {
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/freelancers/${id}`
      );

      setFreelancer(profileRes.data.data);
    } catch (error) {
      console.error('Error fetching freelancer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="freelancer-profile-message">
        Loading profile...
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="freelancer-profile-message">
        Freelancer not found
      </div>
    );
  }

  return (
    <div className="freelancer-profile-page">
      <Navbar />

      <div className="freelancer-profile-container">

        <ProfileHeader freelancer={freelancer} />

        <ProfileBio bio={freelancer.bio} />

        <ProfileSkills skills={freelancer.skills} />

        <ProfilePortfolio portfolio={freelancer.portfolio} />

      </div>
    </div>
  );
};

export default FreelancerProfile;