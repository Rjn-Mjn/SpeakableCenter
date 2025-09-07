import { useEffect, useState } from "react";

const fallbackAccounts = [
  {
    AccountID: 1,
    Fullname: "Eleanor Pena",
    Email: "eleanor.pena@example.com",
    PhoneNumber: "+1236988567",
    RoleName: "student",
    Status: "active",
    AvatarLink: "https://i.pravatar.cc/40?img=1",
    DOC: "2023-01-01",
    DateOfBirth: "2001-05-02",
    Gender: "Female",
    Address: "TA-107 New York",
  },
  {
    AccountID: 2,
    Fullname: "Jessia Rose",
    Email: "jessia.rose@example.com",
    PhoneNumber: "+1238988569",
    RoleName: "moder",
    Status: "inactive",
    AvatarLink: "https://i.pravatar.cc/40?img=2",
    DOC: "2023-02-01",
    DateOfBirth: "2000-04-03",
    Gender: "Female",
    Address: "TA-107 New York",
  },
  {
    AccountID: 1,
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
    AccountID: 2,
    Fullname: "Trần Thị B",
    Email: "tranthib@example.com",
    PhoneNumber: "0987654321",
    RoleName: "moder",
    Status: "Active",
    AvatarLink: "https://i.pravatar.cc/100?img=2",
    DOC: "2024-07-15",
    DateOfBirth: "1998-11-03",
    Gender: "Female",
    Address: "Hồ Chí Minh",
  },
  {
    AccountID: 3,
    Fullname: "Lê Văn C",
    Email: "levanc@example.com",
    PhoneNumber: "0901122334",
    RoleName: "user",
    Status: "Inactive",
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
    RoleName: "user",
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
    RoleName: "moder",
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
    RoleName: "user",
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
    RoleName: "user",
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
    RoleName: "user",
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
    RoleName: "user",
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
    RoleName: "user",
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
    RoleName: "moder",
    Status: "Active",
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
    RoleName: "user",
    Status: "Inactive",
    AvatarLink: "https://i.pravatar.cc/100?img=12",
    DOC: "2021-07-07",
    DateOfBirth: "1990-06-06",
    Gender: "Female",
    Address: "Gia Lai",
  },
  // 👉 add thêm vài record mẫu nữa nếu muốn
];

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/accounts", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        console.log(data);

        // đảm bảo data là array
        if (Array.isArray(data)) {
          setAccounts(data);
          setTotal(data);
        } else if (Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
          setTotal(data.accounts);
        } else {
          console.warn("API không trả về array, fallback mock data");
          setAccounts(fallbackAccounts);
          setTotal(fallbackAccounts);
        }
      } catch (err) {
        console.warn("⚠️ API fetch failed, using fallback data:", err.message);
        setAccounts(fallbackAccounts);
        setTotal(fallbackAccounts);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return { accounts, loading };
}
