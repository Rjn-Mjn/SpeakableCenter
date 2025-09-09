// import React, { useState } from "react";
import { Plus } from "lucide-react";
import SortToggle from "../components/sort-toggle";
import "../styles/accounts-manager.css";
import AccountsTable from "../components/AccountsTable";
import { DashboardContext } from "../components/DashboardContext";
import { useState, useRef, useEffect, useContext } from "react";
import AccountsPageNavigate from "../components/PageNavigate";
// import { useEffect, useState } from "react";

export default function AccountsManager() {
  const fallbackAccounts = [
    {
      AccountID: 1,
      Fullname: "Nguyen Luu Thien Nguyen",
      Email: "eleanor.pena@example.com",
      PhoneNumber: "84911556656",
      RoleName: "Admin",
      Status: "active",
      AvatarLink: "https://i.pravatar.cc/40?img=1",
      DOC: "2023-01-01",
      DateOfBirth: "2001-05-02",
      Gender: "Female",
      Address: "65 Hưng Định 07, Hưng Thọ, Thuận An, Hồ Chí Minh",
    },
    {
      AccountID: 2,
      Fullname: "Jessia Rose",
      Email: "jessia.rose@example.com",
      PhoneNumber: "+1238988569",
      RoleName: "Moderators",
      Status: "pending",
      AvatarLink: "https://i.pravatar.cc/40?img=2",
      DOC: "2023-02-01",
      DateOfBirth: "2000-04-03",
      Gender: "Female",
      Address: "TA-107 New York",
    },
    {
      AccountID: 3,
      Fullname: "Lê Văn C",
      Email: "levanc@example.com",
      PhoneNumber: "0901122334",
      RoleName: "Students",
      Status: "pending",
      AvatarLink: "https://i.pravatar.cc/100?img=3",
      DOC: "2024-05-20",
      DateOfBirth: "2000-01-20",
      Gender: "Male",
      Address: "Đà Nẵng",
    },
    // thêm nhiều bản ghi để test pagination
    {
      AccountID: 4,
      Fullname: "Phạm Thị D",
      Email: "pd@example.com",
      PhoneNumber: "0900001111",
      RoleName: "Students",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=4",
      DOC: "2024-06-02",
      DateOfBirth: "1997-02-07",
      Gender: "Female",
      Address: "Cần Thơ",
    },
    {
      AccountID: 5,
      Fullname: "Hoàng Nam",
      Email: "hn@example.com",
      PhoneNumber: "0911002003",
      RoleName: "Moderators",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=5",
      DOC: "2024-01-21",
      DateOfBirth: "1992-09-14",
      Gender: "Male",
      Address: "Huế",
    },
    {
      AccountID: 6,
      Fullname: "Đặng Mai",
      Email: "dm@example.com",
      PhoneNumber: "0933004005",
      RoleName: "Students",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=6",
      DOC: "2023-11-11",
      DateOfBirth: "2001-12-12",
      Gender: "Female",
      Address: "Bình Dương",
    },
    {
      AccountID: 7,
      Fullname: "Trương Long",
      Email: "tl@example.com",
      PhoneNumber: "0944005006",
      RoleName: "Students",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=7",
      DOC: "2024-02-14",
      DateOfBirth: "1999-04-01",
      Gender: "Male",
      Address: "Vũng Tàu",
    },
    {
      AccountID: 8,
      Fullname: "Phan Hương",
      Email: "ph@example.com",
      PhoneNumber: "0955006007",
      RoleName: "Students",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=8",
      DOC: "2024-03-03",
      DateOfBirth: "1996-08-08",
      Gender: "Female",
      Address: "Nha Trang",
    },
    {
      AccountID: 9,
      Fullname: "Vũ Minh",
      Email: "vm@example.com",
      PhoneNumber: "0966007008",
      RoleName: "Students",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=9",
      DOC: "2023-09-09",
      DateOfBirth: "1994-07-07",
      Gender: "Male",
      Address: "Quảng Ninh",
    },
    {
      AccountID: 10,
      Fullname: "Bùi Lan",
      Email: "bl@example.com",
      PhoneNumber: "0977008009",
      RoleName: "Students",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=10",
      DOC: "2022-12-12",
      DateOfBirth: "2002-10-10",
      Gender: "Female",
      Address: "Hải Phòng",
    },
    {
      AccountID: 11,
      Fullname: "Ngô Trí",
      Email: "nt@example.com",
      PhoneNumber: "0988009001",
      RoleName: "Moderators",
      Status: "Blocked",
      AvatarLink: "https://i.pravatar.cc/100?img=11",
      DOC: "2024-04-04",
      DateOfBirth: "1993-03-03",
      Gender: "Male",
      Address: "Long An",
    },
    {
      AccountID: 12,
      Fullname: "Hoài Phương",
      Email: "hp@example.com",
      PhoneNumber: "0999000002",
      RoleName: "Students",
      Status: "pending",
      AvatarLink: "https://i.pravatar.cc/100?img=12",
      DOC: "2021-07-07",
      DateOfBirth: "1990-06-06",
      Gender: "Female",
      Address: "Gia Lai",
    },
    {
      AccountID: 13,
      Fullname: "Nguyễn Văn A",
      Email: "nguyenvana@example.com",
      PhoneNumber: "0912345678",
      RoleName: "admin",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=1",
      DOC: "2024-08-01", // date of creation (shifted from SQL)
      DateOfBirth: "1995-05-12",
      Gender: "Male",
      Address: "Hà Nội",
    },
    {
      AccountID: 14,
      Fullname: "Trần Thị B",
      Email: "tranthib@example.com",
      PhoneNumber: "0987654321",
      RoleName: "Moderators",
      Status: "Active",
      AvatarLink: "https://i.pravatar.cc/100?img=2",
      DOC: "2024-07-15",
      DateOfBirth: "1998-11-03",
      Gender: "Female",
      Address: "Hồ Chí Minh",
    },
  ];
  // const [accounts, setAccounts] = useState([]);
  // console.log(accounts);

  // useEffect(() => {
  //   fetch("/api/accounts", {
  //     credentials: "include", // cần để gửi session cookie kèm theo
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setAccounts(data); // data là array từ API
  //       // setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       // setLoading(false);
  //     });
  // }, []);

  const { currentUser } = useContext(DashboardContext);
  const contentRef = useRef(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [students, setStudents] = useState([]);
  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);
  console.log(total);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollTo) el.scrollTo({ top: 0, behavior: "smooth" });
    else el.scrollTop = 0;
  }, [page]); // ← mỗi lần đổi trang, cuộn lên đầu

  return (
    <div className="accounts-container">
      <div className="account-top">
        <SortToggle
          page={page}
          pageSize={pageSize}
          setStudents={setStudents}
          setTotal={setTotal}
          fallbackAccounts={fallbackAccounts}
        />
        <div className="create-new-accounts">
          <Plus size={20} strokeWidth={3} />
          <h2>CREATE NEW ACCOUNTS</h2>
        </div>
      </div>
      <div className="accounts-content" ref={contentRef}>
        <AccountsTable
          page={page}
          setTotal={setTotal}
          pageSize={pageSize}
          fallbackAccounts={fallbackAccounts}
          students={students}
          setStudents={setStudents}
          currentUser={currentUser}
        />
      </div>
      <div className="accounts-bottom">
        <div className="sort-tool">
          <div className="sort-tool-container">
            <h2>Sort tool</h2>
          </div>
        </div>
        <div className="pager-indicator">
          <AccountsPageNavigate
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
