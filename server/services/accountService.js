import {
  getAccounts,
  getTargetRole,
  toggleRole,
  toggleStatus,
} from "../models/sql.js";

export async function getAllAccounts(
  page = 1,
  limit = 10,
  status = null,
  role = null
) {
  // normalize inputs
  page = Number.isNaN(+page) ? 1 : Math.max(1, parseInt(page, 10));
  limit = Number.isNaN(+limit) ? 10 : Math.max(1, parseInt(limit, 10));
  console.log("Status service: ", status);
  console.log("Role service: ", role);

  // map UI status -> API status
  const normalizeStatus = (s) => {
    if (!s) return null;
    const t = String(s).trim().toLowerCase();
    if (t === "working") return "active";
    if (["active", "pending", "blocked"].includes(t)) return t;
    return null;
  };

  const normalizeRole = (r) => {
    if (!r) return null;
    return String(r).trim();
  };

  const apiStatus = normalizeStatus(status);
  const apiRole = normalizeRole(role);

  // If no filters, keep previous behavior
  if (!apiStatus && !apiRole) {
    const result = await getAccounts(page, limit);
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  // If getAccounts function declares params for filters (arity check),
  // prefer calling it with filters (most efficient if implemented).
  try {
    if (typeof getAccounts === "function" && getAccounts.length >= 4) {
      // assume signature: getAccounts(page, limit, status, role)
      const result = await getAccounts(page, limit, apiStatus, apiRole);
      return {
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }
  } catch (err) {
    // If calling with extra args failed, we'll fallback to bulk+filter below
    console.warn(
      "getAccounts with filters failed, falling back to in-memory filter:",
      err
    );
  }

  // FALLBACK: fetch bulk and filter in JS, then paginate
  // Be careful with MAX_FETCH — tune according to your dataset & memory.
  const MAX_FETCH = 10000; // cap to avoid OOM; increase only if safe
  const fetchLimit = MAX_FETCH;
  const allResult = await getAccounts(1, fetchLimit);

  const allRows = Array.isArray(allResult.data) ? allResult.data : [];

  const filtered = allRows.filter((row) => {
    let ok = true;
    if (apiStatus) {
      const rowStatus = (row.Status || row.status || "")
        .toString()
        .toLowerCase();
      ok = ok && rowStatus === apiStatus.toLowerCase();
    }
    if (apiRole && ok) {
      const rowRole = (row.RoleName || row.role || "").toString().toLowerCase();
      ok = ok && rowRole === apiRole.toLowerCase();
    }
    return ok;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function updateAccountStatus(accountId, status, RoleName) {
  const result = await toggleStatus(accountId, status, RoleName);
  console.log("service role: ", RoleName);
  console.log("service status: ", status);

  // console.log(result);
}

export async function updateAccountRole(accountId, RoleName) {
  const result = await toggleRole(accountId, RoleName);
  // console.log(result);
}

export async function accountDelete(accountId) {
  const result = await deleteAccount(accountId);
  // console.log(result);
}

export async function examineTargetRole(id) {
  const result = await getTargetRole(id);
  // console.log(result);
  return {
    role: result,
  };
}
