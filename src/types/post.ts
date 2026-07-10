export interface PostItem {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface PostData {
  posts: PostItem[];
}

export interface TimelineCardProps {
  post: {
    id: number;
    imageUrl: string;
    caption?: string;
    createdAt: string;
    author?: {
      id: number;
      username: string;
      name: string;
      avatarUrl: string | null;
    };
    likeCount?: number;
    commentCount?: number;
    likedByMe?: boolean;
    savedByMe?: boolean; // Mengantisipasi skema bookmark masa depan
  };
  currentUsername?: string; // Untuk pengecekan hak akses tombol hapus data post sendiri
}
