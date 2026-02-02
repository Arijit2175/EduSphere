import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function AnimationPlayer({ path, loop = true, style, className }) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadAnimation = async () => {
      try {
        const res = await fetch(path);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) setAnimationData(data);
      } catch {
        // Ignore load errors
      }
    };
    loadAnimation();
    return () => {
      isMounted = false;
    };
  }, [path]);

  if (!animationData) return null;

  return <Lottie animationData={animationData} loop={loop} style={style} className={className} />;
}
