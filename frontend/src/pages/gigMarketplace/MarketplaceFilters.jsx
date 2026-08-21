const CATEGORIES = [
  {
    value: "",
    label: "All Categories",
  },
  {
    value: "web-development",
    label: "Web Development",
  },
  {
    value: "mobile-development",
    label: "Mobile Development",
  },
  {
    value: "design",
    label: "Design",
  },
  {
    value: "writing",
    label: "Writing",
  },
  {
    value: "marketing",
    label: "Marketing",
  },
  {
    value: "data-science",
    label: "Data Science",
  },
  {
    value: "video-editing",
    label: "Video Editing",
  },
  {
    value: "seo",
    label: "SEO",
  },
  {
    value: "other",
    label: "Other",
  },
];

const MarketplaceFilters = ({
  filters,
  handleFilter,
  clearFilters,
  user,
  navigate,
}) => {
  return (
    <aside className="marketplace-filters">

      <h3>Filters</h3>

      <div className="filter-group">
        <label>Category</label>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilter}
        >
          {CATEGORIES.map((category) => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min Budget ($)</label>

        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilter}
          placeholder="0"
        />
      </div>

      <div className="filter-group">
        <label>Max Budget ($)</label>

        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilter}
          placeholder="Any"
        />
      </div>

      <button
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

      {user?.role === "client" && (
        <button
          className="post-gig-btn"
          onClick={() => navigate("/gigs/create")}
        >
          + Post a Gig
        </button>
      )}

      {user?.role === "freelancer" && (
        <button
          className="ai-match-btn"
          onClick={() => navigate("/ai-match")}
        >
          🤖 AI Match Me
        </button>
      )}

    </aside>
  );
};

export default MarketplaceFilters;