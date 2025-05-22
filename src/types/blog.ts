export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  preview: string;
  image_url: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  author?: BlogAuthor;
  tags?: BlogTag[];
}