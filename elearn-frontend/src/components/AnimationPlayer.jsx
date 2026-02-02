import Lottie from "lottie-react";
import NotFoundAnim from "../assets/404.json";
import SpinnerAnim from "../assets/Spinnerdots.json";

export default function AnimationPlayer({ type = "404", loop = true, style }) {
  const animationData = type === "spinner" ? SpinnerAnim : NotFoundAnim;

  return (
    <div style={style}>
      <Lottie
        animationData={animationData}
        loop={loop}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
