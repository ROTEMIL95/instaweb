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

  let profile;
  try {
    profile = await fetchInstagramProfile(clean);
  } catch {
    return {
      title: `@${clean} | GramWeb`,
      description: `Check out @${clean}'s website, built from their Instagram.`,
    };
  }

  const description = profile.biography
    ? `${profile.fullName} — ${profile.biography}`.slice(0, 160)
    : `Check out @${clean}'s website, built from their Instagram.`;

  return {
    title: `@${clean} | GramWeb`,
    description,
    openGraph: {
      title: `@${clean} | GramWeb`,
      description,
      url: `https://gramweb.app/@${clean}`,
      siteName: "GramWeb",
      images: profile.profilePicUrl
        ? [{ url: profile.profilePicUrl }]
        : undefined,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `@${clean} | GramWeb`,
      description,
      images: profile.profilePicUrl ? [profile.profilePicUrl] : undefined,
    },
    alternates: {
      canonical: `https://gramweb.app/@${clean}`,
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: profile.fullName,
            description: profile.biography,
            image: profile.profilePicUrl,
            url: `https://gramweb.app/@${profile.username}`,
            mainEntity: {
              "@type": "Person",
              name: profile.fullName,
              image: profile.profilePicUrl,
              url: `https://instagram.com/${profile.username}`,
              interactionStatistic: {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/FollowAction",
                userInteractionCount: profile.followersCount,
              },
            },
          }),
        }}
      />
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
