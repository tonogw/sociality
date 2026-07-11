export const queryKeys = {
  feed: (page: number, limit: number) => ["feed", page, limit] as const,

  post: (id: number) => ["post", id] as const,

  comments: (postId: number) => ["comments", postId] as const,

  me: ["me"] as const,

  user: (username: string) => ["user", username] as const,
};
