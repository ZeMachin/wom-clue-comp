export interface Group {
  id: number;
  name: string;
  clanChat: string;
  description?: string;
  homeworld?: number;
  verified: boolean;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
}
