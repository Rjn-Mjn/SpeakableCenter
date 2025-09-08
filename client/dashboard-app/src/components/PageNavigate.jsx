import "../styles/PageNavigate.css";
export default function AccountsPageNavigate({ page, setPage, totalPages }) {
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];

    // luôn thêm trang đầu tiên
    pages.push(1);

    // tính khoảng giữa
    let start = Math.max(2, page - 2);
    let end = Math.min(totalPages - 1, page + 2);

    // nếu gần đầu, mở rộng ra cuối
    if (page <= 3) {
      start = 2;
      end = Math.min(totalPages - 1, maxPagesToShow);
    }

    // nếu gần cuối, mở rộng ra đầu
    if (page >= totalPages - 2) {
      start = Math.max(2, totalPages - (maxPagesToShow - 1));
      end = totalPages - 1;
    }

    // nếu cần dấu "..."
    if (start > 2) {
      pages.push("start-ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("end-ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="page-navigate">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="prev-btn"
      >
        Prev
      </button>

      <div className="page-indicators">
        {pageNumbers.map((p, idx) =>
          p === "start-ellipsis" || p === "end-ellipsis" ? (
            <span key={idx} style={{ padding: "5px 10px" }}>
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setPage(p)}
              className={`page-button ${page === p ? "active" : ""}`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="next-btn"
      >
        Next
      </button>
    </div>
  );
}
