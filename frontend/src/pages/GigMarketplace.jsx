import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/gigMarketplace.css';

const GigMarketplace = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchGigs();
  }, [filters, page]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('page', page);
      params.append('limit', 10);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/search/gigs?${params}`
      );
      setGigs(response.data.data.gigs);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handleGigClick = (gigId) => {
    window.location.href = `/gig/${gigId}`;
  };

  return (
    <div className="gig-marketplace">
      <div className="marketplace-header">
        <h1>Find Your Next Project</h1>
        <p>Browse available gigs from clients worldwide</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min"
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="gigs-container">
        {loading ? (
          <p className="loading">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="no-results">No gigs found. Try different filters.</p>
        ) : (
          <div className="gigs-grid">
            {gigs.map((gig) => (
              <div key={gig._id} className="gig-card" onClick={() => handleGigClick(gig._id)}>
                <div className="gig-header">
                  <h3>{gig.title}</h3>
                  <span className="gig-status">{gig.status}</span>
                </div>
                <p className="gig-description">{gig.description.substring(0, 100)}...</p>
                <div className="gig-details">
                  <span className="category">{gig.category}</span>
                  <span className="budget">${gig.budget.min} - ${gig.budget.max}</span>
                </div>
                <div className="gig-footer">
                  <p className="client-name">By {gig.clientId?.name}</p>
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="btn-prev"
        >
          Previous
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(page + 1)} className="btn-next">
          Next
        </button>
      </div>
    </div>
  );
};

export default GigMarketplace;