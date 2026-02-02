import { useMemo } from "react";
import { Lottie } from "lottie-react";
import Spinnerdots from "../../public/Spinnerdots.json";
import NotFound from "../../public/404.json";

const animationMap = {
  "/Spinnerdots.json": Spinnerdots,
  "/404.json": NotFound,
};

export default function AnimationPlayer({ path, loop = true, style }) {
  const animationData = useMemo(() => {
    return animationMap[path] || null;
  }, [path]);

  if (!animationData) return "...";

  return (
    <div style={style}>
      <Lottie animationData={animationData} loop={loop} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
