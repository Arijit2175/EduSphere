import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Box } from "@mui/material";

export default function AnimationPlayer({ path, loop = true, style, className }) {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAnimation = async () => {
      try {
        const res = await fetch(path);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        if (isMounted && data) {
          setAnimationData(data);
        }
      } catch (err) {
        console.error("Animation load error:", err);
        setError(true);
      }
    };
    loadAnimation();
    return () => {
      isMounted = false;
    };
  }, [path]);

  if (error) return null;
  if (!animationData) return null;

  return (
    <Box style={style} className={className}>
      <Lottie 
        animationData={animationData} 
        loop={loop} 
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
}
