"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

const imageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

const colClass: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export function Lightbox({ images, columns = 3, className = "" }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const isOpen = activeIndex !== null;

  const open = (i: number) => setActiveIndex(i);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() => {
    if (activeIndex === null) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [activeIndex, images.length]);

  const next = useCallback(() => {
    if (activeIndex === null) return;
    setDirection(1);
    setActiveIndex((prev) => (prev! + 1) % images.length);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  const current = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      {/* Grid */}
      <div className={`grid ${colClass[columns]} gap-2 ${className}`}>
        {images.map((img, i) => (
          <motion.button
            key={i}
            onClick={() => open(i)}
            className="relative group overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            aria-label={`Voir ${img.alt}`}
          >
            <div className="aspect-square relative">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn
                size={28}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            key="lightbox-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: "rgba(10,15,20,0.95)" }}
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={28} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-eyebrow text-white/50">
              {activeIndex! + 1} / {images.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Image précédente"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Image */}
            <div
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative"
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    width={1200}
                    height={800}
                    className="max-h-[80vh] w-auto object-contain rounded-lg"
                    style={{ maxWidth: "90vw" }}
                  />
                </motion.div>
              </AnimatePresence>

              {current.caption && (
                <p className="mt-4 text-white/60 text-sm text-center">
                  {current.caption}
                </p>
              )}
            </div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Image suivante"
            >
              <ChevronRight size={32} />
            </button>

            {/* Thumbnails strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(i > activeIndex! ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? "border-[var(--gold)] opacity-100"
                      : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                  aria-label={`Aller à l'image ${i + 1}`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
