"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

const imageVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit:   (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25 } }),
};

const colMap = { 2: "md:columns-2", 3: "md:columns-3", 4: "md:columns-4" };

export function PhotoGallery({ photos, columns = 3, className = "" }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection]     = useState(0);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => setMounted(true), []);

  const isOpen  = activeIndex !== null;
  const current = activeIndex !== null ? photos[activeIndex] : null;

  const close = useCallback(() => setActiveIndex(null), []);

  const go = useCallback(
    (delta: number) => {
      if (activeIndex === null) return;
      setDirection(delta);
      setActiveIndex((i) => (i! + delta + photos.length) % photos.length);
    },
    [activeIndex, photos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, go]);

  const open = (i: number) => {
    setDirection(0);
    setActiveIndex(i);
  };

  return (
    <>
      {/* ── Mobile : scroll horizontal ─────────────────────────── */}
      <div className={`${className} md:hidden`}>
        <div
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => open(i)}
              className="flex-none w-64 snap-start rounded-xl overflow-hidden relative group focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              aria-label={`Voir : ${photo.alt}`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="256px"
                  quality={90}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-medium">{photo.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop : grille masonry ───────────────────────────── */}
      <div className={`${className} hidden md:block ${colMap[columns]} gap-4`}>
        {photos.map((photo, i) => (
          <motion.button
            key={i}
            onClick={() => open(i)}
            className="break-inside-avoid mb-4 w-full rounded-xl overflow-hidden relative group focus-visible:ring-2 focus-visible:ring-[var(--gold)] block"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            aria-label={`Voir : ${photo.alt}`}
          >
            <div className="relative w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={900}
                quality={90}
                className="w-full h-auto object-cover"
                loading={i < 3 ? "eager" : "lazy"}
                sizes={`(max-width: 768px) 100vw, (max-width: 1280px) ${Math.floor(100 / columns)}vw, ${Math.floor(1400 / columns)}px`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Lightbox plein écran (en portal pour échapper à tout ancêtre
          avec transform/filter qui casserait le position:fixed) ──── */}
      {mounted && createPortal(
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            key="gallery-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: "rgba(8,12,18,0.97)" }}
            onClick={close}
          >
            {/* Fermer */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Fermer"
            >
              <X size={26} />
            </button>

            {/* Compteur */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest select-none">
              {activeIndex! + 1} / {photos.length}
            </div>

            {/* Précédent */}
            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-3 sm:left-5 z-10 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Image précédente"
            >
              <ChevronLeft size={30} />
            </button>

            {/* Image principale */}
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
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.src}
                    alt={current.alt}
                    className="max-h-[78vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>

              {current.caption && (
                <p className="mt-4 text-white/55 text-sm text-center max-w-lg">
                  {current.caption}
                </p>
              )}
            </div>

            {/* Suivant */}
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-3 sm:right-5 z-10 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Image suivante"
            >
              <ChevronRight size={30} />
            </button>

            {/* Vignettes */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[80vw] overflow-x-auto pb-1 px-2">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDirection(i > activeIndex! ? 1 : -1);
                      setActiveIndex(i);
                    }}
                    className={`relative flex-shrink-0 w-11 h-11 rounded overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? "border-[var(--gold)] opacity-100 scale-105"
                        : "border-transparent opacity-35 hover:opacity-65"
                    }`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}
