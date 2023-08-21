export interface Snapshot {
  id: number;
  playerId: number;
  createdAt: Date;
  importedAt?: Date;
  data: any;
}
