export default function AccountsPageNavigate({ page, setPage, totalPages }) {
  // Chuyển page

  return (
    <div>
      {/* Pagination */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              margin: "0 2px",
              background: page === i + 1 ? "purple" : "lightgray",
              color: page === i + 1 ? "white" : "black",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
