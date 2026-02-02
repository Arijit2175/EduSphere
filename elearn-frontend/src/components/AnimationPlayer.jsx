import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";

export default function AnimationPlayer({ path, loop = true, style }) {
  const [animationData, setAnimationData] = useState(null);

  const resolvedPath = useMemo(() => {
    const base = import.meta?.env?.BASE_URL || "/";
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${base}${path.slice(1)}`;
    return `${base}${path}`;
  }, [path]);

  useEffect(() => {
    let isMounted = true;
    if (!resolvedPath) return;
    fetch(resolvedPath)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (isMounted && data) setAnimationData(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [resolvedPath]);

  return (
    <div style={style}>
      {animationData ? (
        <Lottie animationData={animationData} loop={loop} style={{ width: "100%", height: "100%" }} />
      ) : null}
    </div>
  );
}
