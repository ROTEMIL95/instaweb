export interface InstagramPost {
  url: string;
  displayUrl: string;
  caption: string | null;
  likesCount: number;
  timestamp: string;
}

export interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followersCount: number;
  postsCount: number;
  externalUrl: string | null;
  isPrivate: boolean;
  category: string | null;
  locationName: string | null;
  posts: InstagramPost[];
}
