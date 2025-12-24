"use client";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const PlaceholdersAndVanishInput = ({
  placeholders,
  onChange,
  onSubmit,
  value: externalValue,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };
  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [placeholders.length]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(externalValue || "");
  const [animating, setAnimating] = useState(false);

  // Sync with external value
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const draw = (e: MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgb(59, 130, 246)";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const animate = (x: number, y: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const absX = x + rect.left;
    const absY = y + rect.top;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "rgb(59, 130, 246)";
      ctx.beginPath();
      ctx.arc(absX, absY, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    const index = newDataRef.current.length;
    newDataRef.current.push({
      x: absX,
      y: absY,
    });

    if (index === 0) {
      requestAnimationFrame(() => animate(x, y));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating && value.trim()) {
      setAnimating(true);
      const form = e.currentTarget.form;
      if (form) {
        onSubmit(e as any);
      }
    }
  };

  return (
    <form
      className={cn(
        "w-full relative bg-white h-[36px] rounded-[6px] border border-[#dbdad7] overflow-hidden transition duration-200 focus-within:border-[#4A90E2]",
        value && "bg-white"
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim() || animating) return;
        setAnimating(true);
        onSubmit(e);
        // Reset after animation completes
        setTimeout(() => {
          setAnimating(false);
        }, 2000);
      }}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none text-base transform-gpu bg-white inset-0 hidden",
          animating && "block"
        )}
        ref={canvasRef}
        width={inputRef.current?.offsetWidth ?? 300}
        height={inputRef.current?.offsetHeight ?? 36}
        onMouseMove={(e) => draw(e.nativeEvent)}
        onMouseLeave={() => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
          }
        }}
      />
      <input
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          onChange(e);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value) {
            // Show results if there's a value
          }
        }}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative text-[14px] z-50 border-none bg-transparent text-[#616161] h-full rounded-[6px] focus:outline-none focus:ring-0 px-3 pr-10",
          animating && "text-transparent"
        )}
      />

      <button
        disabled={!value.trim() || animating}
        type="submit"
        className="absolute right-1 top-1/2 z-50 -translate-y-1/2 h-7 w-7 rounded-[4px] disabled:bg-[#f1f0ee] bg-[#4A90E2] border border-[#dbdad7] disabled:pointer-events-none transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white h-3 w-3"
          initial={{ x: -100, opacity: 0 }}
          animate={
            animating
              ? { x: 0, opacity: 1 }
              : {
                  x: 100,
                  opacity: 0,
                }
          }
          transition={{ duration: 0.2 }}
        >
          <path d="m5 12 14-7-7 14-2-8-8-2Z" />
          <path d="m12 5 7 14-14-7 7-7Z" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center rounded-[6px] pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="w-full truncate text-[14px] font-normal text-[#616161] text-left px-3"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {animating && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center z-50"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[14px] font-normal text-[#616161]"
          >
            {value}
          </motion.p>
        </motion.div>
      )}
    </form>
  );
};

