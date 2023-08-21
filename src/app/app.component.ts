import { Component } from '@angular/core';
import { WiseOldManService } from './services/wise-old-man.service';
import { PlayerGains } from './models/player-gains.model';
import { Gains, HiScore } from './models/hiscore.model';
import { CLUE_WEIGHTS } from './shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private WOMService: WiseOldManService) { }
  competitionId: number = 29203;
  updatePlayers = false;
  numberTopPlayers = 3;
  hiscores: HiScore[] = [];

  async updateStats() {
    const competition = await this.WOMService.getCompetition(this.competitionId);
    const startDate = competition.startsAt.toString();
    const endDate = new Date().toISOString();
    const playerNames: { username: string, displayName: string }[] = competition.participations.map((p) => { return { username: p.player.username.replace(' ', '_'), displayName: p.player.displayName } });

    this.hiscores = playerNames.slice(0, this.numberTopPlayers).map((p) => {
      return {
        username: p.username,
        displayName: p.displayName
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

  numberTopPlayersValueChange($event: any) {
    // console.log('event:', $event);
    // console.log('value:', $event.target.value)
    this.numberTopPlayers = $event.target.value;
  }
}
