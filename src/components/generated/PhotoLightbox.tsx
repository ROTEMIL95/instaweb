"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { InstagramPost } from "@/lib/types";

interface PhotoLightboxProps {
  posts: InstagramPost[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export default function PhotoLightbox({
  posts,
  currentIndex,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  const post = posts[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < posts.length - 1;

  const formattedLikes =
    post.likesCount >= 1_000_000
      ? `${(post.likesCount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
      : post.likesCount >= 1000
        ? `${(post.likesCount / 1000).toFixed(1).replace(/\.0$/, "")}K`
        : post.likesCount.toString();

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(currentIndex - 1);
  }, [hasPrev, currentIndex, onIndexChange]);

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(currentIndex + 1);
  }, [hasNext, currentIndex, onIndexChange]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-10 text-2xl font-light text-white/60 transition-colors hover:text-white"
          aria-label="Close"
        >
          &#x2715;
        </button>

        {/* Image */}
        <div className="relative">
          <Image
            src={post.displayUrl}
            alt={post.caption || `Photo ${currentIndex + 1}`}
            width={800}
            height={800}
            className="max-h-[70vh] w-auto rounded-lg object-contain"
            priority
          />

          {/* Nav arrows */}
          {hasPrev && (
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-lg text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
              aria-label="Previous"
            >
              &#8249;
            </button>
          )}
          {hasNext && (
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-lg text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
              aria-label="Next"
            >
              &#8250;
            </button>
          )}
        </div>

        {/* Caption + likes */}
        <div className="mt-4 w-full max-w-[600px] px-4 text-center">
          {post.caption && (
            <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
              {post.caption}
            </p>
          )}
          <p className="mt-2 text-xs text-white/40">
            {formattedLikes} likes
            <span className="mx-2">·</span>
            {currentIndex + 1} / {posts.length}
          </p>
        </div>
      </div>
    </div>
  );
}
