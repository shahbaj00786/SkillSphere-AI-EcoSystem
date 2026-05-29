import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar.jsx';

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancerData();
  }, [id]);

  const fetchFreelancerData = async () => {
    try {
      const [profileRes, reviewsRes, ratingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/freelancer/${id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/reviews/freelancer/${id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/reviews/freelancer/${id}/rating`),
      ]);
      setFreelancer(profileRes.data.data);
      setReviews(reviewsRes.data.data?.reviews || []);
      setRating(ratingRes.data.data);
    } catch (error) {
      console.error('Error fetching freelancer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;
  if (!freelancer) return <div style={{ padding: '40px', textAlign: 'center' }}>Freelancer not found</div>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px', background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <img
            src={freelancer.userId?.avatar || 'https://img.icons8.com/color/96/user-male-circle--v1.png'}
            alt="avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #4f46e5' }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{freelancer.userId?.name}</h2>
            <p style={{ color: '#666', margin: '4px 0' }}>{freelancer.title}</p>
            <p style={{ color: '#4f46e5', margin: 0 }}>₹{freelancer.hourlyRate}/hr</p>
            {rating && (
              <p style={{ color: '#f59e0b', margin: '4px 0' }}>
                ★ {rating.averageRating?.toFixed(1)} ({rating.totalReviews} reviews)
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <h3>About</h3>
          <p style={{ color: '#444', lineHeight: '1.6' }}>{freelancer.bio || 'No bio provided.'}</p>
        </div>

        {/* Skills */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <h3>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {freelancer.skills?.map((skill, idx) => (
              <span key={idx} style={{ background: '#ede9fe', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                {skill.name} — {skill.proficiencyLevel}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        {freelancer.portfolio?.length > 0 && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3>Portfolio</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {freelancer.portfolio.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px', width: '200px' }}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>{item.title}</p>
                  <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px' }}>{item.description}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontSize: '13px' }}>
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p style={{ color: '#999' }}>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{review.clientId?.name}</strong>
                  <span style={{ color: '#f59e0b' }}>{'★'.repeat(review.rating)}</span>
                </div>
                <p style={{ color: '#555', marginTop: '8px' }}>{review.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default FreelancerProfile;