"use client";

import { useState } from "react";
import Image from "next/image";
import { InstagramPost } from "@/lib/types";
import PhotoLightbox from "./PhotoLightbox";

const FREE_LIMIT = 6;

interface PhotoGridProps {
  posts: InstagramPost[];
}

export default function PhotoGrid({ posts }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (posts.length === 0) return null;

  const visiblePosts = posts.slice(0, FREE_LIMIT);
  const teaserPosts = posts.slice(FREE_LIMIT, FREE_LIMIT + 3);
  const totalCount = posts.length;

  return (
    <>
      {/* Main grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {visiblePosts.map((post, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square overflow-hidden focus:outline-none"
          >
            <Image
              src={post.displayUrl}
              alt={post.caption || `Post ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
          </button>
        ))}
      </div>

      {/* "See all" teaser row */}
      {teaserPosts.length > 0 && (
        <div className="relative grid grid-cols-3 gap-0.5">
          {teaserPosts.map((post, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <Image
                src={post.displayUrl}
                alt=""
                fill
                className="object-cover blur-sm scale-105 brightness-50"
                sizes="33vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-white">
              See all {totalCount} photos
            </p>
            <p className="mt-1 text-xs text-white/50">
              Available with InstaWeb Pro
            </p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          posts={visiblePosts}
          currentIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
