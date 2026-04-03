import Image from "next/image";
import { InstagramPost } from "@/lib/types";

interface PhotoGridProps {
  posts: InstagramPost[];
}

export default function PhotoGrid({ posts }: PhotoGridProps) {
  const displayPosts = posts.slice(0, 6);

  if (displayPosts.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {displayPosts.map((post, i) => (
        <div key={i} className="aspect-square relative overflow-hidden">
          <Image
            src={post.displayUrl}
            alt={post.caption || `Post ${i + 1}`}
            fill
            className="object-cover"
            sizes="33vw"
          />
        </div>
      ))}
    </div>
  );
}
