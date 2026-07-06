"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  parallaxStrength?: number;
  revealOnScroll?: boolean;
  className?: string;
  containerClassName?: string;
  fill?: boolean;
  sizes?: string;
}

export function ImageReveal({
  src,
  alt,
  width,
  height,
  priority = false,
  parallaxStrength = 0.12,
  revealOnScroll = true,
  className = "",
  containerClassName = "",
  fill = false,
  sizes,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallaxStrength * 100}%`, `-${parallaxStrength * 100}%`]
  );
  const y = useSpring(yRaw, { stiffness: 80, damping: 20 });

  const imageProps = fill
    ? { fill: true, sizes: sizes || "(max-width: 1280px) 100vw, 1280px" }
    : { width: width!, height: height! };

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${containerClassName}`}
      initial={revealOnScroll ? { opacity: 0, clipPath: "inset(0 100% 0 0)" } : {}}
      whileInView={revealOnScroll ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : {}}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div style={{ y }} className="h-full w-full">
        <Image
          src={src}
          alt={alt}
          priority={priority}
          className={`object-cover w-full h-full ${className}`}
          {...imageProps}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── HeroImage: full bleed with deeper parallax ── */
interface HeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  overlay?: "nil" | "luxury" | "none";
  children?: React.ReactNode;
  className?: string;
}

const overlayClass = {
  nil:     "overlay-nil",
  luxury:  "overlay-luxury",
  none:    "",
};

export function HeroImage({
  src,
  alt,
  priority = true,
  overlay = "nil",
  children,
  className = "",
}: HeroImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {overlay !== "none" && (
        <div className={`absolute inset-0 ${overlayClass[overlay]}`} />
      )}

      {children && (
        <div className="relative z-10 h-full">{children}</div>
      )}
    </div>
  );
}
