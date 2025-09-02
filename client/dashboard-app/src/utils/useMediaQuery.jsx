// utils/useMediaQuery.jsx
import { useState, useEffect } from "react";

/**
 * useMediaQuery - returns boolean for given media query (SSR-safe)
 * @param {string|number} q - media query string or number (treated as max-width px)
 */
export default function useMediaQuery(q) {
  const makeQuery = (val) => {
    if (typeof val === "number") return `(max-width: ${val}px)`;
    if (typeof val === "string") {
      const s = val.trim();
      // if user passed a raw number string "600", convert to (max-width:600px)
      if (/^\d+$/.test(s)) return `(max-width: ${s}px)`;
      return s;
    }
    return "(max-width:600px)";
  };

  const query = makeQuery(q);

  const getMatch = () => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;

    const m = window.matchMedia(query);
    const handler = (ev) => setMatches(ev.matches);

    // Newer API
    if (typeof m.addEventListener === "function") {
      m.addEventListener("change", handler);
    } else {
      // Safari fallback
      m.addListener(handler);
    }

    // Sync immediately
    setMatches(m.matches);

    return () => {
      if (typeof m.removeEventListener === "function") {
        m.removeEventListener("change", handler);
      } else {
        m.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
