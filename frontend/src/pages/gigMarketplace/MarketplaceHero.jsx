const MarketplaceHero = ({
  search,
  handleFilter,
  handleSearch,
}) => {
  return (
    <section className="marketplace-hero">

      <h1>Find Your Next Project</h1>

      <p>
        Browse available gigs from clients worldwide
      </p>

      <div className="marketplace-search">

        <input
          name="search"
          value={search}
          onChange={handleFilter}
          placeholder="Search gigs by title or skill..."
        />

        <button onClick={handleSearch}>
          Search
        </button>

      </div>
    </section>
  );
};

export default MarketplaceHero;