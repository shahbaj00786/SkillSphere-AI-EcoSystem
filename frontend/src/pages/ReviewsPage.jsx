import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/reviews.css';
import Navbar from '../components/common/Navbar.jsx';

const ReviewsPage = () => {
  const [freelancerId, setFreelancerId] = useState(localStorage.getItem('userId'));
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    gigId: '',
    rating: 5,
    comment: '',
    categories: {
      communication: 5,
      quality: 5,
      timeliness: 5,
      professionalism: 5,
    },
  });

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchReviews();
  }, [freelancerId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/freelancer/${freelancerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(response.data.data.reviews);
      if (response.data.data.rating) {
        setRating(response.data.data.rating);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('categories.')) {
      const category = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: parseInt(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews`,
        {
          ...formData,
          freelancerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      fetchReviews();
      setFormData({
        gigId: '',
        rating: 5,
        comment: '',
        categories: {
          communication: 5,
          quality: 5,
          timeliness: 5,
          professionalism: 5,
        },
      });
    } catch (error) {
      alert('Error submitting review');
      console.error(error);
    }
  };

  const renderStars = (value) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= value ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-container">
      <Navbar/>
      <div className="reviews-header">
        <h1>Reviews & Ratings</h1>
        {rating && (
          <div className="rating-summary">
            <div className="rating-score">{rating.averageRating?.toFixed(1)}</div>
            {renderStars(Math.round(rating.averageRating))}
            <p className="total-reviews">Based on {rating.totalReviews} reviews</p>
          </div>
        )}
      </div>

      {rating && (
        <div className="category-ratings">
          <h3>Category Breakdown</h3>
          <div className="categories-grid">
            <div className="category-item">
              <p>Communication</p>
              {renderStars(Math.round(rating.avgCommunication))}
              <span className="rating-value">{rating.avgCommunication?.toFixed(1)}</span>
            </div>
            <div className="category-item">
              <p>Quality</p>
              {renderStars(Math.round(rating.avgQuality))}
              <span className="rating-value">{rating.avgQuality?.toFixed(1)}</span>
            </div>
            <div className="category-item">
              <p>Timeliness</p>
              {renderStars(Math.round(rating.avgTimeliness))}
              <span className="rating-value">{rating.avgTimeliness?.toFixed(1)}</span>
            </div>
            <div className="category-item">
              <p>Professionalism</p>
              {renderStars(Math.round(rating.avgProfessionalism))}
              <span className="rating-value">{rating.avgProfessionalism?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="reviews-section">
        <div className="reviews-header-row">
          <h2>Client Reviews</h2>
          <button
            className="btn-add-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Add Review'}
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={submitReview}>
            <div className="form-group">
              <label>Gig ID *</label>
              <input
                type="text"
                name="gigId"
                value={formData.gigId}
                onChange={handleFormChange}
                placeholder="Gig ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Overall Rating *</label>
              <select name="rating" value={formData.rating} onChange={handleFormChange}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Communication</label>
              <select
                name="categories.communication"
                value={formData.categories.communication}
                onChange={handleFormChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quality</label>
              <select
                name="categories.quality"
                value={formData.categories.quality}
                onChange={handleFormChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Timeliness</label>
              <select
                name="categories.timeliness"
                value={formData.categories.timeliness}
                onChange={handleFormChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Professionalism</label>
              <select
                name="categories.professionalism"
                value={formData.categories.professionalism}
                onChange={handleFormChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Comment *</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleFormChange}
                placeholder="Share your experience..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Submit Review
            </button>
          </form>
        )}

        {loading ? (
          <p className="loading">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <img
                      src={review.clientId?.avatar || '/default-avatar.png'}
                      alt="avatar"
                    />
                    <div>
                      <p className="reviewer-name">{review.clientId?.name}</p>
                      <p className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;