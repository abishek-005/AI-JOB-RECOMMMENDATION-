"use client";

import { useId, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  [key: string]: any;
}

function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);

  useEffect(() => {
    const pattern = patternRef.current;
    if (!pattern) return;

    // Slow organic drift — the entire dot grid gently floats
    // in a looping figure-8 path using two staggered tweens
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(pattern, {
      attr: { x: 6, y: 4 },
      duration: 4,
      ease: "sine.inOut",
    });
    tl.to(pattern, {
      attr: { x: -4, y: 6 },
      duration: 5,
      ease: "sine.inOut",
    });
    tl.to(pattern, {
      attr: { x: 3, y: -3 },
      duration: 4.5,
      ease: "sine.inOut",
    });
    tl.to(pattern, {
      attr: { x: 0, y: 0 },
      duration: 3.5,
      ease: "sine.inOut",
    });

    // Subtle breathing pulse on each dot
    const circle = pattern.querySelector("circle");
    if (circle) {
      gsap.to(circle, {
        attr: { r: cr * 1.25 },
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(circle);
    };
  }, [cr]);

  // Mouse proximity glow — dots near the cursor grow via mask shift
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      gsap.to(svg, {
        attr: {},
        duration: 0.6,
        ease: "power2.out",
        // Dynamically shift the radial mask center toward the cursor
        onUpdate: function () {
          svg.style.maskImage = `radial-gradient(600px circle at ${px}% ${py}%, white, transparent)`;
          svg.style.webkitMaskImage = `radial-gradient(600px circle at ${px}% ${py}%, white, transparent)`;
        },
      });
    };

    const handleMouseLeave = () => {
      gsap.to(svg, {
        duration: 1.0,
        ease: "power2.out",
        onUpdate: function () {
          svg.style.maskImage = `radial-gradient(900px circle at 50% 50%, white, transparent)`;
          svg.style.webkitMaskImage = `radial-gradient(900px circle at 50% 50%, white, transparent)`;
        },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      style={{
        maskImage: "radial-gradient(900px circle at 50% 50%, white, transparent)",
        WebkitMaskImage: "radial-gradient(900px circle at 50% 50%, white, transparent)",
        transition: "mask-image 0.3s ease",
      }}
      {...props}
    >
      <defs>
        <pattern
          ref={patternRef}
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export { DotPattern };
