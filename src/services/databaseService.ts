// @ts-ignore
import SuperDB from 'superdb';

export interface WalkRecord {
  walkId: string;
  startTime: number;
  endTime: number;
  routePoints: any[];
  emotionMarks: any[];
  cardsCompleted: number;
}

export interface CardRecord {
  id: string;
  type: string;
  content: string;
  createdAt: number;
}

class WalkDatabase {
  private db: any;
  constructor() {
    this.db = new SuperDB({
      url: import.meta.env.VITE_SUPERDB_URL,
      apiKey: import.meta.env.VITE_SUPERDB_KEY
    });
  }
  async saveWalk(walk: WalkRecord): Promise<void> {
    await this.db.collection('walks').create(walk);
  }
  async getWalkHistory(): Promise<WalkRecord[]> {
    return await this.db.collection('walks').orderBy('startTime', 'desc').get();
  }
  async saveCard(card: CardRecord): Promise<void> {
    await this.db.collection('cards').create(card);
  }
}

export const db = new WalkDatabase(); 