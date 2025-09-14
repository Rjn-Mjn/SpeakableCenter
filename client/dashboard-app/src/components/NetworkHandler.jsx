import { useEffect, useState } from "react";
import NetworkErrorPage from "../pages/NetworkErrorPage";
import SkeletonLoader from "./SkeletonLoader";
// import SkeletonLoader from "../components/SkeletonLoader";

export default function NetworkHandler({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [forceErrorPage, setForceErrorPage] = useState(false);

  useEffect(() => {
    let timeout;

    function handleOnline() {
      setIsOnline(true);
      setShowSkeleton(false);
      setForceErrorPage(false);
      clearTimeout(timeout);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowSkeleton(true);

      // Sau 5 giây mà vẫn offline thì show ErrorPage
      timeout = setTimeout(() => {
        if (!navigator.onLine) {
          setForceErrorPage(true);
        }
      }, 5000);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (forceErrorPage) return <NetworkErrorPage />;
  if (showSkeleton && !isOnline) return <SkeletonLoader />;

  return children;
}
