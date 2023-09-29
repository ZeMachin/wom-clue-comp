import { Component, OnInit } from '@angular/core';
import { CompetitionDetails } from '../models/competition.model';
import { HiScore } from '../models/hiscore.model';
import { CompetitionParticipationDetails } from '../models/participation.model';
import { getGainsTotal } from '../services/helpers/gains';
import { WiseOldManService } from '../services/wise-old-man/wise-old-man.service';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.less']
})
export class CompetitionComponent implements OnInit {

  constructor(private WOMService: WiseOldManService) { }
  competitionId: number = 0;
  metrics?: {name: string, weight: number}[];
  hiscores: HiScore[] = [];
  title: string = 'No competition at this time';

  ngOnInit(): void {
    this.competitionId = 31221;
    this.metrics = [
      { name: 'vardorvis', weight: 0.6 },
      { name: 'duke_sucellus', weight: 0.8 },
      { name: 'the_leviathan', weight: 1 },
      { name: 'the_whisperer', weight: 1.15 }
    ];
    this.updateStats();
  }

  async updateStats() {
    // Getting competition details from API
    const competition = await this.WOMService.getCompetition(this.competitionId);
    // Getting our title
    this.title = competition.title;
    // Creating our hiscores with the player names and ids
    this.hiscores = competition.participations.map((p) => this.createHiScore(p));

    // If metrics other than the ones configured in the competition are being used, we get the appropriate data
    if(this.metrics) {
      const competitions: any = {};
      for (const metric of this.metrics)
        competitions[metric.name as keyof typeof competitions] = await this.WOMService.getCompetition(this.competitionId, metric.name);
      Object.keys(competitions).forEach((k) => 
        this.hiscores.forEach(h => {
          const participation = (competitions[k as keyof typeof competitions] as CompetitionDetails)?.participations.find((participation) => participation.playerId === h.playerId);
          h.gains[k] = participation?.progress.gained!;
      }))
      this.hiscores.forEach((h) => h.gains.total = getGainsTotal(h.gains, this.metrics!));
    } 

    console.log('hiscores:', this.hiscores);

    setInterval(() => this.hiscores.sort((h1, h2) => h2.gains?.total! - h1.gains?.total!), 1000);
  }  
  
  createHiScore(participation: CompetitionParticipationDetails): HiScore {
    return {
      playerId: participation.playerId,
      username: participation.player.username.replace(' ', '_'), 
      displayName: participation.player.displayName,
      gains: {
        total: participation.progress.gained
      }
    };
  }

  formatTitle(title: string): string {
    return title.split('_').map((w) => this.capitalize(w)).reduce((w1, w2) => w1 + ' ' + w2);
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
