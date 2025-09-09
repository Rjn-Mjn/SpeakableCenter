import { useState, useEffect } from "react";
import React from "react";
import "../styles/acounts-table.css";
import { Cog, Pencil, Trash2 } from "lucide-react";

export default function AccountsTable({
  page,
  setTotal,
  pageSize,
  fallbackAccounts,
  students,
  setStudents,
  currentUser,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/accounts?page=${page}&limit=${pageSize}`);
        const result = await res.json();
        setStudents(result.accounts);
        setTotal(result.total);
      } catch {
        // fallback mock data nếu dev
        setStudents(fallbackAccounts);
        setTotal(200);
      }
    }
    fetchData();
  }, [page]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === students.length) {
      setSelected([]); // uncheck all
    } else {
      setSelected(students.map((s) => s.AccountID)); // check all
    }
  };

  const toggleStatus = async (account) => {
    // logic chuyển status
    let newStatus;
    if (account.Status === "active") newStatus = "pending";
    else if (account.Status === "pending") newStatus = "blocked";
    else newStatus = "active";

    let newRoleName;
    if (newStatus === "active") {
      newRoleName =
        account.RoleName === "Guest" ? "Students" : account.RoleName;
    } else if (newStatus === "pending") {
      newRoleName = "Guest";
    } else if (newStatus === "blocked") {
      newRoleName = account.RoleName;
    }

    console.log("new status: ", newStatus);
    console.log("new role: ", newRoleName);

    const prevStatus = account.Status;
    const prevRole = account.RoleName;

    try {
      // gọi API update
      const res = await fetch(`/api/accounts/${account.AccountID}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RoleName: newRoleName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Warning: ${errData.error}`);
        return;
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.AccountID === account.AccountID
            ? { ...s, Status: newStatus, RoleName: newRoleName }
            : s
        )
      );
    } catch (err) {
      console.error("Error updating status", err);

      setStudents((prev) =>
        prev.map((s) =>
          s.AccountID === account.AccountID
            ? { ...s, Status: prevStatus, RoleName: prevRole }
            : s
        )
      );
    }
  };

  const toggleRole = async (account) => {
    // logic chuyển status
    const currentRole = account.RoleName;
    let newRoleName;

    if (currentUser.RoleName === "Moderator") {
      // Moderator chỉ được Guest <-> Students
      if (currentRole === "Guest") newRoleName = "Students";
      else if (currentRole === "Students") newRoleName = "Guest";
      else {
        alert("Moderator chỉ đổi được giữa Guest và Students.");
        return;
      }
    } else if (currentUser.RoleName === "Admin") {
      // Admin cycle 4 role
      const cycle = ["Guest", "Students", "Moderator", "Admin"];
      const idx = cycle.indexOf(currentRole);
      newRoleName = cycle[(idx + 1) % cycle.length];
    } else {
      alert("Bạn không có quyền đổi role.");
      return;
    }

    let newStatus;
    if (newRoleName === "Guest") {
      newStatus = "pending";
    } else if (newRoleName === "Students") {
      newStatus = "active"; // giữ nguyên (hoặc định nghĩa lại theo logic của bạn)
    } else {
      newStatus = account.Status; // giữ nguyên (hoặc định nghĩa lại theo logic của bạn)
    }

    const prevStatus = account.Status;
    const prevRole = account.RoleName;

    try {
      // gọi API update
      const res = await fetch(`/api/accounts/${account.AccountID}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, RoleName: newRoleName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Warning: ${errData.error}`);
        return;
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.AccountID === account.AccountID
            ? { ...s, Status: newStatus, RoleName: newRoleName }
            : s
        )
      );
    } catch (err) {
      console.error("Error updating status", err);

      setStudents((prev) =>
        prev.map((s) =>
          s.AccountID === account.AccountID
            ? { ...s, Status: prevStatus, RoleName: prevRole }
            : s
        )
      );
    }
  };

  const deleteAccount = async (account) => {
    setStudents((prev) => {
      // backup state hiện tại
      const backup = [...prev];
      // gắn backup vào account để có thể rollback
      account._backup = backup;
      return prev;
    });

    try {
      const res = await fetch(`/api/accounts/${account.AccountID}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Warning: ${errData.error}`);
        // rollback
        setStudents(account._backup);
        return;
      }

      // API thành công → remove account khỏi state
      setStudents((prev) =>
        prev.filter((s) => s.AccountID !== account.AccountID)
      );
    } catch (err) {
      console.error("Error deleting account", err);
      alert("Có lỗi khi xóa account. Vui lòng thử lại.");
      // rollback
      setStudents(account._backup);
    }
  };

  return (
    <table
      className="accounts-table"
      // border="1"
      cellPadding="8"
      // style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th>
            <div className="account-cell check-box">
              <input
                type="checkbox"
                checked={
                  selected.length === students.length && students.length > 0
                }
                onChange={toggleSelectAll}
              />
            </div>
          </th>
          <th>
            <div className="account-cell name">Student Name</div>
          </th>
          <th>
            <div className="account-cell email">Email</div>
          </th>
          <th>
            <div className="account-cell phone">Phone</div>{" "}
          </th>
          <th>
            <div className="account-cell address">
              <span>Address</span>
            </div>
          </th>
          <th>
            <div className="account-cell">Date of Birth</div>
          </th>
          <th>
            <div className="account-cell">Role</div>
          </th>
          <th>
            <div className="account-cell status">Status</div>
          </th>
          <th>
            <div className="account-cell">Action</div>
          </th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.AccountID}>
            <td>
              <div className="account-cell check-box">
                <input
                  type="checkbox"
                  checked={selected.includes(s.AccountID)}
                  onChange={() => toggleSelect(s.AccountID)}
                />
              </div>
            </td>
            <td>
              <div className="account-cell name">
                <img
                  className="account-avatar"
                  src={`https://audiox.space/api/avatar?url=${encodeURIComponent(
                    s.AvatarLink
                  )}`}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = s.AvatarLink; // ảnh thay thế
                  }}
                />
                <h2>{s.Fullname}</h2>
              </div>
            </td>
            <td>
              <div className="account-cell email">
                <h2>{s.Email}</h2>
              </div>
            </td>
            <td>
              <div className="account-cell phone">
                <h2>{s.PhoneNumber}</h2>
              </div>
            </td>
            <td>
              <div className="account-cell address">
                <h2>{s.Address}</h2>
              </div>
            </td>
            <td>
              <div className="account-cell dob">
                <h2>{s.DateOfBirth}</h2>
              </div>
            </td>
            <td>
              <div className="account-cell role">
                <button
                  className={`role-btn ${s.RoleName.toLowerCase()}`}
                  onClick={() => toggleRole(s)}
                >
                  {s.RoleName}
                </button>
              </div>
            </td>
            <td>
              <div className="account-cell status">
                <button
                  className={`status-btn ${s.Status.toLowerCase()}`}
                  onClick={() => toggleStatus(s)}
                >
                  {s.Status}
                </button>
              </div>
            </td>
            <td>
              <div className="account-cell action-btns">
                <button className="action-btn">
                  <Cog />
                </button>
                <button className="action-btn" onClick={() => deleteAccount(s)}>
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
