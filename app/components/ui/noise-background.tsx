"use client";
import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NoiseBackgroundProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseIntensity?: number;
  speed?: number;
  backdropBlur?: boolean;
  animating?: boolean;
}

export function NoiseBackground({
  children,
  className,
  containerClassName,
  gradientColors = ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
  noiseIntensity = 0.2,
  speed = 0.1,
  backdropBlur = false,
  animating = true,
}: NoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate noise texture once and reuse
    const generateNoiseTexture = (width: number, height: number) => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        const alpha = noiseIntensity * 255;
        data[i] = noise; // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = alpha; // A
      }

      return imageData;
    };

    let noiseTexture: ImageData | null = null;

    const animate = () => {
      if (!animating) return;

      timeRef.current += speed;
      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Generate noise texture if needed or if size changed
      if (!noiseTexture || noiseTexture.width !== width || noiseTexture.height !== height) {
        noiseTexture = generateNoiseTexture(width, height);
      }

      // Create animated gradient
      const angle = (timeRef.current * 0.5) % (Math.PI * 2);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const gradient = ctx.createLinearGradient(
        width / 2 - (width / 2) * cos,
        height / 2 - (height / 2) * sin,
        width / 2 + (width / 2) * cos,
        height / 2 + (height / 2) * sin
      );

      // Add color stops with animation
      const numColors = gradientColors.length;
      for (let i = 0; i < numColors; i++) {
        const baseStop = i / numColors;
        const animatedStop = (baseStop + (timeRef.current * 0.01)) % 1;
        gradient.addColorStop(animatedStop, gradientColors[i]);
      }

      // Fill with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Apply noise overlay using composite operation
      if (noiseTexture) {
        ctx.globalCompositeOperation = "overlay";
        ctx.putImageData(noiseTexture, 0, 0);
        ctx.globalCompositeOperation = "source-over";
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gradientColors, noiseIntensity, speed, animating]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full pointer-events-none",
          backdropBlur && "backdrop-blur-sm"
        )}
        style={{ zIndex: 0 }}
      />
      <div className={cn("relative", className)} style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
