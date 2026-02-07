import { useEffect, useMemo, useState } from "react";
import "./Shuffle.css";

const splitChars = (text) => Array.from(text || "");

const getKeyframes = (direction) => {
  switch (direction) {
    case "up":
      return "shuffleUp";
    case "left":
      return "shuffleLeft";
    case "right":
      return "shuffleRight";
    case "down":
    default:
      return "shuffleDown";
  }
};

export default function Shuffle({
  text,
  className = "",
  shuffleDirection = "down",
  duration = 0.35,
  stagger = 0.03,
  triggerOnHover = true,
  loop = false,
  loopDelay = 2,
  respectReducedMotion = true,
}) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!loop) return;
    const id = setInterval(() => setCycle((prev) => prev + 1), (duration + loopDelay) * 1000);
    return () => clearInterval(id);
  }, [loop, duration, loopDelay]);

  const reduceMotion = useMemo(() => {
    if (!respectReducedMotion || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [respectReducedMotion]);

  const chars = splitChars(text);
  const keyframes = getKeyframes(shuffleDirection);

  const handleHover = () => {
    if (!triggerOnHover || reduceMotion) return;
    setCycle((prev) => prev + 1);
  };

  return (
    <span className={`shuffle-parent ${className}`} onMouseEnter={handleHover}>
      {chars.map((ch, i) => (
        <span
          key={`${cycle}-${i}`}
          className="shuffle-char"
          style={{
            animationName: reduceMotion ? "none" : keyframes,
            animationDuration: `${duration}s`,
            animationDelay: `${i * stagger}s`,
            animationFillMode: "both",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
