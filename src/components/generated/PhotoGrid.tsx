"use client";

import { useState } from "react";
import Image from "next/image";
import { InstagramPost } from "@/lib/types";
import PhotoLightbox from "./PhotoLightbox";

interface PhotoGridProps {
  posts: InstagramPost[];
}

export default function PhotoGrid({ posts }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (posts.length === 0) return null;

  return (
    <>
      {/* Photo grid — show all available posts */}
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post, i) => (
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

      {/* Pro teaser */}
      {posts.length >= 12 && (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-5 text-center">
          <p className="text-sm font-semibold text-gray-500">
            Want to show more photos?
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Unlock up to 200 photos with InstaWeb Pro
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          posts={posts}
          currentIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
