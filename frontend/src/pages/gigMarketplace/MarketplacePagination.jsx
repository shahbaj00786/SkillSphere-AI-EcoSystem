const MarketplacePagination = ({
  page,
  hasMore,
  setPage,
}) => {
  return (
    <div className="marketplace-pagination">

      <button
        onClick={() =>
          setPage((current) => current - 1)
        }
        disabled={page === 1}
      >
        ← Previous
      </button>

      <span>
        Page {page}
      </span>

      <button
        onClick={() =>
          setPage((current) => current + 1)
        }
        disabled={!hasMore}
      >
        Next →
      </button>

    </div>
  );
};

export default MarketplacePagination;