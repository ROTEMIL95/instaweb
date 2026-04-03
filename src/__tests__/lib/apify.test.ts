import { transformApifyData } from "@/lib/apify";

const mockApifyResponse = {
  username: "cafe42",
  fullName: "Café 42",
  biography: "Specialty coffee & fresh pastries\nOpen daily 7am–10pm",
  profilePicUrl: "https://example.com/pic.jpg",
  followersCount: 12400,
  postsCount: 847,
  externalUrl: "https://cafe42.com",
  private: false,
  businessCategoryName: "Coffee Shop",
  locationName: "Tel Aviv",
  latestPosts: [
    {
      url: "https://instagram.com/p/abc",
      displayUrl: "https://example.com/photo1.jpg",
      caption: "Best latte in town",
      likesCount: 234,
      timestamp: "2026-03-15T10:00:00.000Z",
    },
    {
      url: "https://instagram.com/p/def",
      displayUrl: "https://example.com/photo2.jpg",
      caption: null,
      likesCount: 189,
      timestamp: "2026-03-14T10:00:00.000Z",
    },
  ],
};

describe("transformApifyData", () => {
  it("transforms Apify response to InstagramProfile", () => {
    const result = transformApifyData(mockApifyResponse);

    expect(result.username).toBe("cafe42");
    expect(result.fullName).toBe("Café 42");
    expect(result.biography).toBe(
      "Specialty coffee & fresh pastries\nOpen daily 7am–10pm"
    );
    expect(result.followersCount).toBe(12400);
    expect(result.externalUrl).toBe("https://cafe42.com");
    expect(result.isPrivate).toBe(false);
    expect(result.category).toBe("Coffee Shop");
    expect(result.locationName).toBe("Tel Aviv");
    expect(result.posts).toHaveLength(2);
    expect(result.posts[0].displayUrl).toBe(
      "https://example.com/photo1.jpg"
    );
  });

  it("handles missing optional fields", () => {
    const minimal = {
      ...mockApifyResponse,
      externalUrl: null,
      businessCategoryName: null,
      locationName: null,
      latestPosts: [],
    };
    const result = transformApifyData(minimal);

    expect(result.externalUrl).toBeNull();
    expect(result.category).toBeNull();
    expect(result.posts).toHaveLength(0);
  });
});
