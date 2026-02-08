import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const easeMap = {
  "power3.out": [0.22, 1, 0.36, 1],
  "power2.out": [0.25, 0.46, 0.45, 0.94],
  "power1.out": [0.4, 0, 0.2, 1],
};

const normalizeEase = (ease) => {
  if (Array.isArray(ease)) return ease;
  return easeMap[ease] || "easeOut";
};

const splitTextToParts = (text, splitType) => {
  if (!text) return [];
  if (splitType && splitType.includes("words")) {
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }
  return Array.from(text);
};

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
  showCallback = false,
  style = {},
}) {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const inView = useInView(ref, { once: true, amount: threshold, margin: rootMargin });

  useEffect(() => {
    if (inView) {
      setHasAnimated(true);
    }
  }, [inView]);

  const parts = useMemo(() => splitTextToParts(text, splitType), [text, splitType]);

  const Tag = tag || "p";
  const staggerDelay = delay / 1000;
  const resolvedEase = normalizeEase(ease);

  return (
    <Tag
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        display: "inline-block",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        overflow: "hidden",
        ...style,
      }}
      aria-label={text}
    >
      {parts.map((part, index) => {
        const isSpace = part === " ";
        const content = isSpace ? "\u00A0" : part;
        return (
          <motion.span
            key={`${part}-${index}`}
            initial={from}
            animate={hasAnimated ? to : from}
            transition={{ duration, ease: resolvedEase, delay: index * staggerDelay }}
            style={{ display: "inline-block", willChange: "transform, opacity" }}
            onAnimationComplete={
              index === parts.length - 1
                ? () => {
                    if (showCallback) {
                      // eslint-disable-next-line no-console
                      console.log("All letters have animated!");
                    }
                    onLetterAnimationComplete?.();
                  }
                : undefined
            }
          >
            {content}
          </motion.span>
        );
      })}
    </Tag>
  );
}
