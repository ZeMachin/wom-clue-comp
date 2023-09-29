import { Component } from '@angular/core';
import { WiseOldManService } from './services/wise-old-man/wise-old-man.service';
import { HiScore } from './models/hiscore.model';
import { DT2DetailsToGains } from './services/helpers/dt2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private WOMService: WiseOldManService) { }
  competitionId: number = 31221;
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

    // this.hiscores.forEach(async (h) => h.gains = this.clueDetailsToGains(await this.WOMService.getPlayerDetails(h.username, startDate, endDate))); // WAS FOR CLUES
    this.hiscores.forEach(async (h) => h.DT2Gains = DT2DetailsToGains(await this.WOMService.getPlayerDetails(h.username, startDate, endDate)));

    setInterval(() => this.hiscores.sort((h1, h2) => h2.clueGains?.total! - h1.clueGains?.total!), 1000);
  }

  numberTopPlayersValueChange($event: any) {
    // console.log('event:', $event);
    // console.log('value:', $event.target.value)
    this.numberTopPlayers = $event.target.value;
  }
}

