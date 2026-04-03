import Image from "next/image";

interface ProfileHeroProps {
  profilePicUrl: string;
  fullName: string;
  username: string;
  biography: string;
  followersCount: number;
  locationName: string | null;
  gradient: string;
}

export default function ProfileHero({
  profilePicUrl,
  fullName,
  username,
  biography,
  followersCount,
  locationName,
  gradient,
}: ProfileHeroProps) {
  const formattedFollowers =
    followersCount >= 1000
      ? `${(followersCount / 1000).toFixed(1).replace(/\.0$/, "")}K`
      : followersCount.toString();

  return (
    <div className="py-12 px-6 text-center text-white" style={{ background: gradient }}>
      <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white/20 overflow-hidden">
        <Image
          src={profilePicUrl}
          alt={fullName}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-extrabold mb-1">{fullName}</h1>
      <p className="text-sm text-white/60 mb-2">@{username}</p>
      {biography && (
        <p className="text-sm text-white/80 leading-relaxed max-w-[300px] mx-auto mb-3 whitespace-pre-line">
          {biography}
        </p>
      )}
      <p className="text-xs text-white/40">
        {locationName && <span>{locationName} · </span>}
        {formattedFollowers} followers
      </p>
    </div>
  );
}
