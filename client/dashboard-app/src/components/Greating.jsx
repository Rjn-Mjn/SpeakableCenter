import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");

  const updateGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Moring🔥");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else if (hour < 22) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  };

  useEffect(() => {
    updateGreeting(); // chạy lần đầu

    // cập nhật mỗi phút để greeting sync với thời gian
    const interval = setInterval(updateGreeting, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <h2>{greeting}</h2>;
}
