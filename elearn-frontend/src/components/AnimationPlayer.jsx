import { useMemo } from "react";
import { Lottie } from "lottie-react";

const animationMap = {
  "/Spinnerdots.json": "/Spinnerdots.json",
  "/404.json": "/404.json",
};

export default function AnimationPlayer({ path, loop = true, style }) {
  const animationPath = useMemo(() => animationMap[path] || null, [path]);

  if (!animationPath) return "...";

  return (
    <div style={style}>
      <Lottie
        path={animationPath}
        loop={loop}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
