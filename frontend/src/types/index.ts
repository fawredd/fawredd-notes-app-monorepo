export interface Tag{
  id: string;
  name: string;
}

export interface Note{
  id: string;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
  updatedAt?: string;
  tags: Tag[];
}

export interface User{
  email: string;
  FullName: String;
}