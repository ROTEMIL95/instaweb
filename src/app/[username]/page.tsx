import { notFound } from "next/navigation";
import { fetchInstagramProfile } from "@/lib/apify";
import { generateProfileGradient } from "@/lib/colors";
import ProfileHero from "@/components/generated/ProfileHero";
import PhotoGrid from "@/components/generated/PhotoGrid";
import LinkButtons from "@/components/generated/LinkButtons";
import SiteFooter from "@/components/generated/SiteFooter";

interface PageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = 86400; // 24 hours ISR

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const clean = decodeURIComponent(username).replace(/^@/, "");
  return {
    title: `@${clean} — InstaWeb`,
    description: `Check out @${clean}'s website, built from their Instagram.`,
  };
}

export default async function GeneratedSitePage({ params }: PageProps) {
  const { username } = await params;
  const clean = decodeURIComponent(username).replace(/^@/, "");

  let profile;
  try {
    profile = await fetchInstagramProfile(clean);
  } catch {
    notFound();
  }

  const gradient = generateProfileGradient(clean);

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <ProfileHero
        profilePicUrl={profile.profilePicUrl}
        fullName={profile.fullName}
        username={profile.username}
        biography={profile.biography}
        followersCount={profile.followersCount}
        locationName={profile.locationName}
        gradient={gradient}
      />
      <PhotoGrid posts={profile.posts} />
      <LinkButtons
        externalUrl={profile.externalUrl}
        username={profile.username}
      />
      <SiteFooter />
    </div>
  );
}
