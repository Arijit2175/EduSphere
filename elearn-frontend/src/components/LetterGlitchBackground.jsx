import { useEffect, useRef } from "react";

export default function LetterGlitchBackground({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  glitchSpeed = 50,
  smooth = true,
  centerVignette = false,
  outerVignette = true,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lettersRef = useRef([]);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const letters = [];
    const letterSize = 20;
    const cols = Math.ceil(canvas.width / letterSize);
    const rows = Math.ceil(canvas.height / letterSize);

    for (let i = 0; i < cols * rows; i++) {
      letters.push({
        x: (i % cols) * letterSize,
        y: Math.floor(i / cols) * letterSize,
        char: characters[Math.floor(Math.random() * characters.length)],
        opacity: Math.random() * 0.5 + 0.2,
        glitchCounter: Math.random() * glitchSpeed,
      });
    }

    lettersRef.current = letters;

    let frameCount = 0;

    const animate = () => {
      ctx.fillStyle = "rgba(74, 58, 92, 0.95)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${letterSize}px 'Courier New', monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      letters.forEach((letter) => {
        letter.glitchCounter--;

        let displayChar = letter.char;
        let alpha = letter.opacity;

        if (letter.glitchCounter <= 0) {
          displayChar =
            characters[Math.floor(Math.random() * characters.length)];
          alpha = Math.random() * 0.8 + 0.3;
          letter.glitchCounter =
            Math.random() * (glitchSpeed * 2) + glitchSpeed;
        }

        if (smooth) {
          alpha =
            letter.opacity +
            (alpha - letter.opacity) * 0.1;
        }

        ctx.fillStyle = glitchColors[Math.floor(Math.random() * glitchColors.length)];
        ctx.globalAlpha = alpha;
        ctx.fillText(displayChar, letter.x, letter.y);
        ctx.globalAlpha = 1;
      });

      // Center vignette
      if (centerVignette) {
        const radialGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.5
        );
        radialGrad.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        radialGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Outer vignette
      if (outerVignette) {
        const radialGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.3,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.8
        );
        radialGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        radialGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const newRect = canvas.parentElement.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [glitchSpeed, smooth, centerVignette, outerVignette, glitchColors]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
