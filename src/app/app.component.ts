import { Component } from '@angular/core';
import { WiseOldManService } from './services/wise-old-man.service';
import { PlayerGains } from './models/player-gains.model';

const CLUE_WEIGHTS = {
  beginner: 0.5,
  easy: 0.5,
  medium: 1,
  hard: 3,
  elite: 4,
  master: 6
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private WOMService: WiseOldManService) { }
  competitionId: number = 29203;
  updatePlayers = false;
  numberTopPlayers = 10;
  hiscores: HiScore[] = [];

  async updateStats() {
    const competition = await this.WOMService.getCompetition(this.competitionId);
    const startDate = competition.startsAt.toString();
    const endDate = new Date().toISOString();
    const playerNames: string[] = competition.participations.map((p) => p.player.username.replace(' ', '_'));

    this.hiscores = playerNames.slice(0, this.numberTopPlayers).map((p) => {
      return {
        username: p
      }
    });

    this.hiscores.forEach(async (h) => h.gains = this.detailsToGains(await this.WOMService.getPlayerDetails(h.username, startDate, endDate)));

    setTimeout(() => this.hiscores.sort((h1, h2) => h2.gains?.total! - h1.gains?.total!), 500);
  }

  detailsToGains(playerDetails: PlayerGains): Gains {
    const gains: Gains = {
      beginner: playerDetails.data.activities.clue_scrolls_beginner.score.gained,
      easy: playerDetails.data.activities.clue_scrolls_easy.score.gained,
      medium: playerDetails.data.activities.clue_scrolls_medium.score.gained,
      hard: playerDetails.data.activities.clue_scrolls_hard.score.gained,
      elite: playerDetails.data.activities.clue_scrolls_elite.score.gained,
      master: playerDetails.data.activities.clue_scrolls_master.score.gained,
    }

    gains.total = this.getClueScore(gains);

    return gains;
  }

  getClueScore(gains: Gains): number {
    return gains.beginner * CLUE_WEIGHTS.beginner + gains.easy * CLUE_WEIGHTS.easy + gains.medium * CLUE_WEIGHTS.medium + gains.hard * CLUE_WEIGHTS.hard + gains.elite * CLUE_WEIGHTS.elite + gains.master * CLUE_WEIGHTS.master;
  }
}

interface HiScore {
  username: string;
  gains?: Gains
}

interface Gains {
  beginner: number;
  easy: number;
  medium: number;
  hard: number;
  elite: number;
  master: number;
  total?: number;
}
