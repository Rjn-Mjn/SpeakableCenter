import React, { useEffect, useRef, useState } from "react";

/**
 * RandomStepSpinner
 * Props:
 * - isLoading: boolean -> only renders when true
 * - duration: number (ms) -> total animation time (default 2000)
 * - onComplete: () => void -> called AFTER shrink animation
 * - size: number -> diameter in px (default 64)
 * - className: string -> extra wrapper classes
 * - shrinkDuration: number (ms) -> time of shrink animation (default 350)
 */
export default function RandomStepSpinner({
  isLoading,
  duration = 2000,
  onComplete = () => {},
  size = 64,
  className = "",
  shrinkDuration = 350,
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | running | shrinking
  const timeoutsRef = useRef([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    // stop if turned off
    if (!isLoading) {
      if (phase === "running") {
        // do nothing — allow spinner to finish naturally
        return;
      }
      // otherwise cleanup and reset
      setProgress(0);
      setPhase("idle");
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
      return;
    }

    if (phase === "running") return;

    // start
    setPhase("running");
    setProgress(0);

    // cleanup previous timers
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // choose random number of steps between 4 and 8
    const steps = Math.floor(Math.random() * 5) + 4; // 4..8

    // random percent weights
    const pWeights = Array.from({ length: steps }, () => Math.random());
    const pSum = pWeights.reduce((a, b) => a + b, 0);
    let percents = pWeights.map((w) => (w / pSum) * 100);

    // normalize rounding so sum becomes exactly 100
    percents = percents.map((p) => Math.floor(p));
    let remainder = 100 - percents.reduce((a, b) => a + b, 0);
    percents[Math.floor(Math.random() * percents.length)] += remainder;

    // time weights to randomize when steps happen
    const tWeights = Array.from({ length: steps }, () => Math.random());
    const tSum = tWeights.reduce((a, b) => a + b, 0);
    const timeSlices = tWeights.map((w) => (w / tSum) * duration);

    // schedule updates at cumulative times
    let cumTime = 0;
    let cumPercent = 0;
    for (let i = 0; i < steps; i++) {
      cumTime += timeSlices[i];
      cumPercent += percents[i];
      const pct = Math.min(100, Math.max(0, Math.round(cumPercent)));

      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        // only update if still running
        setProgress((prev) => Math.max(prev, pct));
      }, Math.max(0, Math.round(cumTime)));

      timeoutsRef.current.push(t);
    }

    // final timeout to ensure 100% exactly at duration
    const finalT = setTimeout(() => {
      if (!mountedRef.current) return;
      setProgress(100);
      // start shrink after a tiny pause to let 100% render
      const shrinkT = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase("shrinking");
        // after shrink animation ends, call onComplete
        const doneT = setTimeout(() => {
          if (!mountedRef.current) return;
          setPhase("idle");
          timeoutsRef.current.forEach((tt) => clearTimeout(tt));
          timeoutsRef.current = [];
          try {
            onComplete();
          } catch (e) {
            // swallow user callback errors
            // eslint-disable-next-line no-console
            console.error("onComplete callback error:", e);
          }
        }, shrinkDuration);
        timeoutsRef.current.push(doneT);
      }, 80);
      timeoutsRef.current.push(shrinkT);
    }, duration);

    timeoutsRef.current.push(finalT);

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, [isLoading, duration, onComplete, shrinkDuration]);

  // only render when isLoading true
  if (!isLoading && phase === "idle") return null;

  const diameter = size;
  const stroke = Math.max(4, Math.round(size * 0.08));
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress / 100);

  // scale for shrinking
  const scale = phase === "shrinking" ? 0.6 : 1;
  const opacity = phase === "shrinking" ? 0 : 1;

  return (
    <div
      className={`rss-container ${className}`}
      role="status"
      aria-live="polite"
      style={
        {
          // transform: `scale(${scale})`,
          // opacity,
          // transition: `transform ${shrinkDuration}ms ease, opacity ${shrinkDuration}ms ease`,
        }
      }
    >
      <div
        className="loading-container"
        style={{
          transform: `scale(${scale})`,
          opacity,
          transition: `transform ${shrinkDuration}ms ease, opacity ${shrinkDuration}ms ease`,
        }}
      >
        <div className="rss-spinner-wrap">
          <div
            className="rss-spinner"
            style={{ width: diameter, height: diameter }}
          >
            <svg
              className="rss-svg"
              width={diameter}
              height={diameter}
              viewBox={`0 0 ${diameter} ${diameter}`}
              style={{ transform: "rotate(-90deg)" }}
            >
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%">
                  {/* <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" /> */}
                  <stop offset="0%" stopColor="#49c5d5ff" />
                  <stop offset="100%" stopColor="#69ddc8" />
                </linearGradient>
              </defs>

              {/* background track */}
              <circle
                className="rss-track"
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                strokeWidth={stroke}
                fill="none"
              />

              {/* progress stroke */}
              <circle
                className="rss-progress"
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
              />
            </svg>

            {/* rotating small knob on top */}
            {/* <div
              className="rss-knob"
              style={{
                width: stroke * 1.2,
                height: stroke * 1.2,
                top: -stroke / 2,
              }}
            /> */}
          </div>
        </div>

        {/* <div className="rss-text">Đang xử lý — {progress}%</div> */}
        <div className="rss-text loading-text">Setting up your profile...</div>
      </div>
      <style>{`
        .rss-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .rss-spinner-wrap {
          position: relative;
          display: inline-grid;
          place-items: center;
        }
        .rss-spinner { position: relative; }

        .rss-svg { display: block; }

        .rss-track {
          stroke: rgba(0,0,0,0.12);
        }

        .rss-progress {
          stroke: url(#g1);
          transition: stroke-dashoffset 180ms linear;
        }

        .rss-knob {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: linear-gradient(90deg,#7c3aed,#06b6d4);
          animation: rspin linear infinite;
        }

        .rss-text {
          font-size: 14px;
          color: #334155; /* slate-700 */
        }

        @keyframes rspin {
          to { transform: translateX(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
