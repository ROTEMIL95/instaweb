import { InstagramProfile, InstagramPost } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformApifyData(data: any): InstagramProfile {
  const posts: InstagramPost[] = (data.latestPosts || [])
    .slice(0, 24)
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (post: any): InstagramPost => ({
        url: post.url,
        displayUrl: post.displayUrl,
        caption: post.caption || null,
        likesCount: post.likesCount || 0,
        timestamp: post.timestamp,
      })
    );

  return {
    username: data.username,
    fullName: data.fullName || data.username,
    biography: data.biography || "",
    profilePicUrl: data.profilePicUrl,
    followersCount: data.followersCount || 0,
    postsCount: data.postsCount || 0,
    externalUrl: data.externalUrl || null,
    isPrivate: data.private || false,
    category: data.businessCategoryName || null,
    locationName: data.locationName || null,
    posts,
  };
}

export async function fetchInstagramProfile(
  username: string
): Promise<InstagramProfile> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured");
  }

  const cleanUsername = username.replace(/^@/, "");

  const response = await fetch(
    "https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usernames: [cleanUsername],
        resultsLimit: 24,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Apify API error: ${response.status}`);
  }

  const results = await response.json();

  if (!results || results.length === 0) {
    throw new Error(`Profile not found: @${cleanUsername}`);
  }

  const profile = transformApifyData(results[0]);

  if (profile.isPrivate) {
    throw new Error(`Profile @${cleanUsername} is private`);
  }

  return profile;
}
