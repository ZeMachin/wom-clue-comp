import { Component, OnInit } from '@angular/core';
import { WiseOldManService } from './services/wise-old-man/wise-old-man.service';
import { DT2Gains, HiScore } from './models/hiscore.model';
import { CompetitionDetails } from './models/competition.model';
import { CompetitionParticipationDetails } from './models/participation.model';
import { getDT2Score } from './services/helpers/dt2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(private WOMService: WiseOldManService) { }
  competitionId: number = 31221;
  hiscores: HiScore[] = [];
  title: string = 'No competition at this time';

  ngOnInit(): void {
    this.updateStats();
  }

  async updateStats() {
    const competitions: { 
      vardorvis?: CompetitionDetails,
      duke_sucellus?: CompetitionDetails,
      the_whisperer?: CompetitionDetails,
      the_leviathan?: CompetitionDetails
    } = {
      vardorvis: undefined,
      duke_sucellus: undefined,
      the_whisperer: undefined,
      the_leviathan: undefined
    };
    for (const metric of Object.keys(competitions))
      competitions[metric as keyof typeof competitions] = await this.WOMService.getCompetition(this.competitionId, metric);

    this.hiscores = Object.values(competitions)[0].participations.map((p) => this.createHiScore(p));
    this.title = Object.values(competitions)[0].title;
    
    Object.keys(competitions).forEach((k) => 
      this.hiscores.forEach(h => {
        const participation = competitions[k as keyof typeof competitions]?.participations.find((participation) => participation.playerId === h.playerId);
        h.DT2Gains[k as keyof DT2Gains] = participation?.progress.gained!;
      }))

    this.hiscores.forEach((h) => h.DT2Gains.total = getDT2Score(h.DT2Gains));

    console.log('hiscores:', this.hiscores);

    setInterval(() => this.hiscores.sort((h1, h2) => h2.DT2Gains?.total! - h1.DT2Gains?.total!), 1000);
  }  
  
  createHiScore(participation: CompetitionParticipationDetails): HiScore {
    return {
      playerId: participation.playerId,
      username: participation.player.username.replace(' ', '_'), 
      displayName: participation.player.displayName,
      DT2Gains: {
        vardorvis: 0,
        duke_sucellus: 0,
        the_leviathan: 0,
        the_whisperer: 0,
      }
    };
  }
}
