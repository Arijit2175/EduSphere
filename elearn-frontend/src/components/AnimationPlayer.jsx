import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function AnimationPlayer({ path, loop = true, style }) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(path)
      .then(res => res.json())
      .then(data => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [path]);

  if (!animationData) return null;

  return <Lottie animationData={animationData} loop={loop} style={style} />;
}
