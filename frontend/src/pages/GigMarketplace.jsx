import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/common/Navbar.jsx";

import MarketplaceHero from "./gigMarketplace/MarketplaceHero.jsx";
import MarketplaceFilters from "./gigMarketplace/MarketplaceFilters.jsx";
import GigCard from "./gigMarketplace/GigCard.jsx";
import MarketplacePagination from "./gigMarketplace/MarketplacePagination.jsx";

import "../styles/gigMarketplace.css";

const GigMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  useEffect(() => {
    fetchGigs();
  }, [filters, page]);

  const fetchGigs = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filters.category) {
        params.append("category", filters.category);
      }

      if (filters.minPrice) {
        params.append("minPrice", filters.minPrice);
      }

      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
      }

      if (filters.search) {
        params.append("search", filters.search);
      }

      params.append("page", page);
      params.append("limit", 9);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/search/gigs?${params}`
      );

      const data = response.data.data?.gigs || [];

      setGigs(data);
      setHasMore(data.length === 9);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });

    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchGigs();
  };

  return (
    <div className="gig-marketplace-page">
      <Navbar />

      <MarketplaceHero
        search={filters.search}
        handleFilter={handleFilter}
        handleSearch={handleSearch}
      />

      <div className="marketplace-container">
        <div className="marketplace-layout">

          <MarketplaceFilters
            filters={filters}
            handleFilter={handleFilter}
            clearFilters={clearFilters}
            user={user}
            navigate={navigate}
          />

          <main className="marketplace-results">

            {loading ? (
              <div className="marketplace-message">
                <p>Loading gigs...</p>
              </div>
            ) : gigs.length === 0 ? (
              <div className="marketplace-empty">
                <div className="empty-icon">🔍</div>

                <p>
                  No gigs found. Try different filters.
                </p>
              </div>
            ) : (
              <>
                <p className="gig-count">
                  {gigs.length} gig
                  {gigs.length !== 1 ? "s" : ""} found
                </p>

                <div className="gigs-grid">
                  {gigs.map((gig) => (
                    <GigCard
                      key={gig._id}
                      gig={gig}
                      navigate={navigate}
                    />
                  ))}
                </div>

                <MarketplacePagination
                  page={page}
                  hasMore={hasMore}
                  setPage={setPage}
                />
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default GigMarketplace;