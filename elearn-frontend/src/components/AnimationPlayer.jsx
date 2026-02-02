import { useMemo } from "react";
import { Player } from "lottie-react";
import NotFoundAnim from "../assets/404.json";
import SpinnerAnim from "../assets/Spinnerdots.json";

const animationMap = {
  "404": NotFoundAnim,
  "spinner": SpinnerAnim,
};

export default function AnimationPlayer({ type = "404", loop = true, style }) {
  const animationData = useMemo(() => animationMap[type], [type]);

  if (!animationData) return null;

  return (
    <div style={style}>
      <Player
        autoplay
        loop={loop}
        src={animationData}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
