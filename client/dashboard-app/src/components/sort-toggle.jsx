import React, { useState, useEffect } from "react";
import "../styles/SortToggle.css";

export default function SortToggle({
  page = 1,
  pageSize,
  setStudents,
  setTotal,
  fallbackAccounts,
}) {
  const [active, setActive] = useState({
    all: true,
    status: null, // "Working" | "Pending" | "Blocked" (UI labels)
    role: null, // "Students" | "Moderators"
  });

  // Helper: map UI status -> API status
  const mapStatusToApi = (statusLabel) => {
    if (!statusLabel) return null;
    if (statusLabel === "Working") return "active";
    return statusLabel.toLowerCase(); // "Pending" -> "pending", "Blocked" -> "blocked"
  };

  // Build query string from filters (returns like "&status=active&role=Students")
  const buildQueryFromFilters = ({ all, status, role }) => {
    if (all) return "";
    const parts = [];
    const apiStatus = mapStatusToApi(status);
    if (apiStatus) parts.push(`status=${encodeURIComponent(apiStatus)}`);
    if (role) parts.push(`role=${encodeURIComponent(role)}`);
    return parts.length ? `&${parts.join("&")}` : "";
  };

  // Core fetch (from a given filter-state)
  const fetchAccountsFromFilters = async (filterState) => {
    const query = buildQueryFromFilters(filterState);
    const url = `/api/accounts?page=${page}&limit=${pageSize}${query}`;
    console.log(url);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        // fallback
        const maybe = await res.json().catch(() => ({}));
        console.warn("Fetch non-ok:", maybe);
        setStudents(fallbackAccounts);
        setTotal(fallbackAccounts?.length ?? 0);
        return;
      }
      const result = await res.json();
      setStudents(result.accounts || []);
      setTotal(
        typeof result.total === "number"
          ? result.total
          : result.accounts?.length ?? 0
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setStudents(fallbackAccounts);
      setTotal(fallbackAccounts?.length ?? 0);
    }
  };

  // Handlers — compute nextState, setActive, then fetch using that state (avoid race)
  const handleGetAll = async () => {
    const next = { all: true, status: null, role: null };
    setActive(next);
    await fetchAccountsFromFilters(next);
  };

  const handleGetByStatus = async (statusLabel) => {
    const next = { all: false, status: statusLabel, role: active.role ?? null };
    setActive(next);
    await fetchAccountsFromFilters(next);
  };

  const handleGetByRole = async (roleLabel) => {
    const next = { all: false, status: active.status ?? null, role: roleLabel };
    setActive(next);
    await fetchAccountsFromFilters(next);
  };

  // Refetch when page changes (keeps current filters)
  useEffect(() => {
    fetchAccountsFromFilters(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // accessible key handler helper
  const handleKey = (e, fn) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="sort-toggle">
      {/* ALL */}
      <div className="sort-bar all">
        <div
          className={`sort-object ${active.all ? "active" : ""}`}
          onClick={handleGetAll}
          onKeyDown={(e) => handleKey(e, handleGetAll)}
          role="button"
          tabIndex={0}
        >
          <h2>ALL</h2>
        </div>
      </div>

      {/* STATUS */}
      <div className="sort-bar status">
        {["Working", "Pending", "Blocked"].map((s) => (
          <div
            key={s}
            className={`sort-object ${s.toLowerCase()} ${
              active.status === s ? "active" : ""
            }`}
            onClick={() => handleGetByStatus(s)}
            onKeyDown={(e) => handleKey(e, () => handleGetByStatus(s))}
            role="button"
            tabIndex={0}
          >
            <h2>{s}</h2>
          </div>
        ))}
      </div>

      {/* ROLE (OBJECT) */}
      <div className="sort-bar object students">
        {["Admin", "Moderator", "Students", "Guest"].map((o) => (
          <div
            key={o}
            className={`sort-object ${o.toLowerCase()} ${
              active.role === o ? "active" : ""
            }`}
            onClick={() => handleGetByRole(o)}
            onKeyDown={(e) => handleKey(e, () => handleGetByRole(o))}
            role="button"
            tabIndex={0}
          >
            <h2>{o}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
