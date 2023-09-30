import { Component, OnInit } from '@angular/core';
import { CompetitionDetails } from '../models/competition.model';
import { HiScore } from '../models/hiscore.model';
import { CompetitionParticipationDetails } from '../models/participation.model';
import { getGainsTotal } from '../services/helpers/gains';
import { WiseOldManService } from '../services/wise-old-man/wise-old-man.service';
import { ActivatedRoute } from '@angular/router';
import { differenceInHours } from 'date-fns';

const PLAYER_UPDATE_DELAY = 6; // Minimum of hours to wait between two player updates
const NUMBER_PLAYERS_UPDATE = 450; // Number of players that will be updated. 

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.less']
})
export class CompetitionComponent implements OnInit {

  constructor(private WOMService: WiseOldManService, private activatedRoute: ActivatedRoute) { }
  competitionId: number = 0;
  metrics?: {name: string, weight: number}[];
  hiscores: HiScore[] = [];
  title: string = 'No competition at this time';

  ngOnInit(): void {
    this.competitionId = parseInt(this.activatedRoute.snapshot.queryParamMap.get('competitionId')!);
    const metrics = this.activatedRoute.snapshot.queryParamMap.get('metrics');
    if(metrics !== null)
      this.metrics = JSON.parse(metrics);
    this.updateStats();
  }

  async updateStats(filter: boolean = true) {
    // Getting competition details from API
    const competition = await this.WOMService.getCompetition(this.competitionId);
    // Getting our title
    this.title = competition.title;
    // Creating our hiscores with the player names and ids
    let hiscores = competition.participations.map((p) => this.createHiScore(p));

    // If metrics other than the ones configured in the competition are being used, we get the appropriate data
    if(this.metrics) {
      const competitions: any = {};
      for (const metric of this.metrics)
        competitions[metric.name as keyof typeof competitions] = await this.WOMService.getCompetition(this.competitionId, metric.name);
      Object.keys(competitions).forEach((k) => 
        hiscores.forEach(h => {
          const participation = (competitions[k as keyof typeof competitions] as CompetitionDetails)?.participations.find((participation) => participation.playerId === h.playerId);
          h.gains[k] = participation?.progress.gained!;
      }))
      hiscores.forEach((h) => h.gains.total = getGainsTotal(h.gains, this.metrics!));
    } 

    // console.log('hiscores:', this.hiscores);
    if(filter) hiscores = hiscores.filter((h) => h.gains.total != 0);

    this.hiscores = hiscores;

    setInterval(() => this.hiscores.sort((h1, h2) => h2.gains?.total! - h1.gains?.total!), 1000);
  }  
  
  createHiScore(participation: CompetitionParticipationDetails): HiScore {
    return {
      playerId: participation.playerId,
      username: participation.player.username.replace(' ', '_'), 
      displayName: participation.player.displayName,
      gains: {
        total: participation.progress.gained
      },
      lastUpdated: new Date(participation.updatedAt)
    };
  }

  formatTitle(title: string): string {
    return title.split('_').map((w) => this.capitalize(w)).reduce((w1, w2) => w1 + ' ' + w2);
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  async updatePlayers() {
    this.updateStats(false);
    const metricsLength = this.metrics ? this.metrics.length : 0;
    const updateList = this.hiscores.filter((h) => differenceInHours(Date.now(), h.lastUpdated) > PLAYER_UPDATE_DELAY).sort((h1, h2) => h1.lastUpdated.getTime() - h2.lastUpdated.getTime()).slice(0, NUMBER_PLAYERS_UPDATE - metricsLength * 2 - 3); // Filters out players that have been updated less than $PLAYER_UPDATE_DELAY hours ago, and sorts them by last updated
    // While waiting for the API key, number has to be < 100 - 2 * # of metrics
    for(let hiscore of updateList)
      await this.WOMService.updatePlayer(hiscore.username)
            .catch((err) => console.error(err));
    this.updateStats();
  }

  formatNumber(num: string): string {
    return parseFloat(num).toFixed(2).replace(/\.0+$/, '');
  }
}
