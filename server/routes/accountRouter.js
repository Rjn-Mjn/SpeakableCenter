import express from "express";
import {
  examineTargetRole,
  updateAccountRole,
  updateAccountStatus,
  getAllAccounts,
  accountDelete,
} from "../services/accountService.js";

const router = express.Router();

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.RoleName)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log(req.user.RoleName);

    next();
  };
}

// API endpoint
const ALLOWED_STATUSES = new Set(["active", "pending", "blocked"]);
const UI_STATUS_MAP = {
  working: "active",
  working_: "active",
  workinglabel: "active",
  // thêm mapping nếu cần
};

function normalizeStatus(s) {
  if (!s) return null;
  const lower = s.toString().trim().toLowerCase();
  if (ALLOWED_STATUSES.has(lower)) return lower;
  if (UI_STATUS_MAP[lower]) return UI_STATUS_MAP[lower];
  // support "Working" from UI:
  if (lower === "working") return "active";
  return null;
}

function normalizeRole(r) {
  if (!r) return null;
  return r.toString().trim(); // keep case as sent (we'll compare in query case-insensitive)
}

router.get("/", requireRole(["Admin", "Moderator"]), async (req, res) => {
  // parse + defaults
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(
    200,
    Math.max(1, parseInt(req.query.limit || "10", 10))
  ); // giới hạn max để tránh abuse
  const rawStatus = req.query.status;
  const rawRole = req.query.role || req.query.RoleName; // chấp nhận role hoặc RoleName
  console.log("Raw status: ", rawStatus);
  console.log("Raw role: ", rawRole);

  const status = normalizeStatus(rawStatus);
  const role = normalizeRole(rawRole);
  console.log("Status: ", status);
  console.log("Role: ", role);

  try {
    const result = await getAllAccounts(page, limit, status, role);

    res.json({
      success: true,
      accounts: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (err) {
    console.error("GET /api/accounts error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, RoleName } = req.body;
    console.log("status: ", status);
    console.log("role: ", RoleName);

    const currentUser = req.user;
    if (!["Admin", "Moderator"].includes(currentUser.RoleName)) {
      return res.status(403).json({ error: "Permission denied." });
    }

    if (currentUser.AccountID == id) {
      // Nếu muốn đổi role của chính mình sang khác admin => chặn
      if (
        RoleName &&
        RoleName !== "Admin" &&
        currentUser.RoleName === "Admin"
      ) {
        return res
          .status(403)
          .json({ error: "You cannot remove your own admin rights." });
      }

      // Nếu muốn đổi status sang blocked/pending => chặn
      if (["blocked", "pending"].includes(status)) {
        return res
          .status(403)
          .json({ error: "You cannot disable your own account." });
      }
    }

    const target = await examineTargetRole(id);
    console.log("object role: ", target.role.RoleName);
    console.log("request role: ", currentUser.RoleName);

    if (target.role.RoleName === "Admin" && currentUser.RoleName !== "Admin") {
      return res.status(403).json({ error: "Cant modify Admin." });
    }

    await updateAccountStatus(id, status, RoleName);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    let { RoleName } = req.body; // let thay vì const
    const currentUser = req.user;

    // Chỉ Admin/Moderator mới có quyền
    if (!["Admin", "Moderator"].includes(currentUser.RoleName)) {
      return res.status(403).json({ error: "Permission denied." });
    }

    // Không được tự hạ cấp/chặn chính mình
    if (currentUser.AccountID == id) {
      if (
        RoleName &&
        RoleName !== "Admin" &&
        currentUser.RoleName === "Admin"
      ) {
        return res
          .status(403)
          .json({ error: "You cannot remove your own admin rights." });
      }
      if (["blocked", "pending"].includes(status)) {
        return res
          .status(403)
          .json({ error: "You cannot disable your own account." });
      }
    }

    // Không phải Admin thì không được chỉnh Admin khác
    const target = await examineTargetRole(id);
    const targetRole = target.role.RoleName;

    if (targetRole === "Admin" && currentUser.RoleName !== "Admin") {
      return res.status(403).json({ error: "Cannot modify Admin." });
    }

    if (currentUser.RoleName === "Moderator") {
      const allowedRoles = ["Guest", "Students"];
      if (!allowedRoles.includes(RoleName)) {
        return res
          .status(403)
          .json({ error: "Moderators can only assign Guest or Students." });
      }
    }

    await updateAccountRole(id, RoleName);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Soft delete account (isDelete = 1)
router.delete("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Check quyền
    if (!["Admin", "Moderator"].includes(currentUser.RoleName)) {
      return res.status(403).json({ error: "Permission denied." });
    }

    // Không cho tự xóa chính mình
    if (currentUser.AccountID == id) {
      return res.status(403).json({ error: "You cannot delete yourself." });
    }

    // Lấy role hiện tại của target user
    const target = await examineTargetRole(id);

    if (!target) {
      return res.status(404).json({ error: "User not found." });
    }

    // Moderator không được xóa Admin
    if (target.RoleName === "Admin" && currentUser.RoleName !== "Admin") {
      return res.status(403).json({ error: "You cannot remove an admin." });
    }

    // Soft delete
    const rowsAffected = await accountDelete(id);

    if (rowsAffected === 0) {
      return res
        .status(404)
        .json({ error: "Account not found or already deleted." });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Delete error: ", err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
