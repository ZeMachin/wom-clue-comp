import { Component, OnInit, ViewChild } from '@angular/core';
import { CompetitionDetails } from '../models/competition.model';
import { HiScore } from '../models/hiscore.model';
import { CompetitionParticipationDetails } from '../models/participation.model';
import { getGainsTotal } from '../services/helpers/gains';
import { WiseOldManService } from '../services/wise-old-man/wise-old-man.service';
import { ActivatedRoute } from '@angular/router';
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { MessageService } from 'primeng/api';
import { PlayerDetails } from '../models/player.model';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdatePlayersModalComponent } from './update-players-modal/update-players-modal.component';

const PLAYER_UPDATE_DELAY = 0; // Minimum of hours to wait between two player updates
const NUMBER_PLAYERS_UPDATE = 450; // Number of players that will be updated. 

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.less']
})
export class CompetitionComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  @ViewChild('categorydialog') categoryDialog!: Dialog;
  @ViewChild('playernamedialog') playerNameDialog!: Dialog;
    
  ref: DynamicDialogRef | undefined;

  competitionId: number = 0;
  metrics?: {name: string, weight: number}[];
  hiscores: HiScore[] = [];
  title: string = 'No competition at this time';
  updating: boolean = false;
  categoryOptions = [
    { label: 'Main', value: 'regular' },
    { label: 'Ironman', value: 'ironman' },
    { label: 'HCIM', value: 'hardcore' },
    { label: 'UIM', value: 'ultimate' },
  ]
  categoryFilter?: { label: string, value: string };
  playerNameFilter?: string;
  categoryFilterVisible: boolean = false;
  playerNameFilterVisible: boolean = false;

  constructor(
    private WOMService: WiseOldManService, 
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  async ngOnInit(): Promise<void> {
    this.competitionId = parseInt(this.activatedRoute.snapshot.queryParamMap.get('competitionId')!);
    const metrics = this.activatedRoute.snapshot.queryParamMap.get('metrics');
    if(metrics !== null)
      this.metrics = JSON.parse(metrics);
    this.hiscores = await this.getUpdatedStats();
  }

  async getUpdatedStats(filter: boolean = true): Promise<HiScore[]> {
    try {
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
          competitions[metric.name as keyof typeof competitions] = await this.WOMService.getCompetition(this.competitionId, metric.name)
        Object.keys(competitions).forEach((k) => 
          hiscores.forEach(h => {
            const participation = (competitions[k as keyof typeof competitions] as CompetitionDetails)?.participations.find((participation) => participation.playerId === h.playerId);
            h.gains[k] = participation?.progress.gained!;
        }))
        hiscores.forEach((h) => h.gains.total = getGainsTotal(h.gains, this.metrics!));
      } 

      // console.log('hiscores:', this.hiscores);
      if(filter) hiscores = hiscores.filter((h) => h.gains.total != 0);
      hiscores.sort((h1, h2) => this.sortTotal(h1, h2))
      hiscores.forEach((h, i) => h.position = i+1);

      return hiscores;
    } catch(err) {
      this.updating = false;
      console.error(err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Failure', 
          detail: `Competition could not be fetched.`,
          life: 2000
        });
    }
    return this.hiscores;
  }  
  
  createHiScore(participation: CompetitionParticipationDetails): HiScore {
    return {
      playerId: participation.playerId,
      username: participation.player.username.replace(' ', '_'), 
      displayName: participation.player.displayName,
      category: participation.player.type,
      gains: {
        total: participation.progress.gained
      },
      lastUpdated: new Date(participation.updatedAt)
    };
  }

  async updatePlayers() {
    if(!this.updating) {
      this.updating = true;
      const updateList = await this.getUpdatedStats(false);
      const metricsLength = this.metrics ? this.metrics.length : 0;
      const sortedFilteredList = updateList.filter((h) => differenceInHours(Date.now(), h.lastUpdated) >= PLAYER_UPDATE_DELAY).sort((h1, h2) => this.sortLastUpdated(h1, h2)).slice(0, NUMBER_PLAYERS_UPDATE - metricsLength * 2 - 3); // Filters out players that have been updated less than $PLAYER_UPDATE_DELAY hours ago, and sorts them by last updated
      // While waiting for the API key, number has to be < 100 - 2 * # of metrics
      // console.log('sortedFilteredList', sortedFilteredList);
      for(let hiscore of sortedFilteredList) 
        if(!await this.updatePlayer(hiscore)) break;
      await this.getUpdatedStats().then(
        (hiscores) => {
          this.hiscores = hiscores;
          this.messageService.add({
            severity: 'success', 
            summary: 'Done', 
            detail: `Finished updating.`,
            life: 30000
          });
          this.updating = false;
        }
      );
    }
  }

  openUpdatePlayersModal() {
    this.ref = this.dialogService.open(UpdatePlayersModalComponent, { header: 'Update all players'});
    this.ref.onClose.subscribe((correct: boolean) => {
      if(correct) {
        this.messageService.clear();
        this.updatePlayers();
      } else this.messageService.add({
        severity: 'error', 
        summary: 'Unlucky', 
        detail: `Incorrect password.`,
        life: 30000
      })
    })
  }

  async updatePlayer(hiscore: HiScore): Promise<boolean> {
    hiscore.updating = true;
    return await this.WOMService.updatePlayer(hiscore.username)
    .then((response: PlayerDetails) => {
      hiscore.updating = false;
      hiscore.lastUpdated = new Date();
      this.messageService.add({ 
      severity: 'success', 
      summary: response.displayName, 
      detail: `${response.displayName} updated successfully.`
      });
      return true;
    })
    .catch((err: HttpErrorResponse) => {
      hiscore.updating = false;
      console.error(err);
      this.messageService.add({ 
        severity: 'error', 
        summary: hiscore.displayName, 
        detail: `${hiscore.displayName} could not be updated.`,
        life: 2000
      });
      return err.status !== 429;
    });
  }

  sortTotal(h1: HiScore, h2: HiScore) {
    return h2.gains?.total! - h1.gains?.total!
  }

  sortLastUpdated(h1: HiScore, h2: HiScore) {
    return h1.lastUpdated.getTime() - h2.lastUpdated.getTime();
  }

  formatNumber(num: string): string {
    return parseFloat(num).toFixed(2).replace(/\.0+$/, '');
  }

  formatTitle(title: string): string {
    return title.split('_').map((w) => this.capitalize(w)).reduce((w1, w2) => w1 + ' ' + w2);
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  getLastUpdatedDuration(hiscore: HiScore): string {
    const hours = differenceInHours(Date.now(), hiscore.lastUpdated);
    if(hours > 0)
      return `${hours}h ago.`;
    const minutes = differenceInMinutes(Date.now(), hiscore.lastUpdated);
    if(minutes > 0)
      return `${minutes}m ago.`;
    const seconds = differenceInSeconds(Date.now(), hiscore.lastUpdated);
    if(seconds > 0)
      return `${seconds}s ago.`;
    return '';
  }

  onCategoryFilterChange(event: any) {
    this.table.filter(event.value, 'category', 'equals');
  }

  onPlayerNameFilterChange(event: any) {
    // console.log('event:', event);
    this.table.filter(this.playerNameFilter, 'displayName', 'contains');
  }

  showCategoryFilter(event: any) {
    // console.log('event:', event);
    this.categoryFilterVisible = !this.categoryFilterVisible;
    this.categoryDialog.style = {position: 'absolute', top: event.pageY , left: event.pageX};
  }

  showPlayerNameFilter(event: any) {
    // console.log('event:', event);
    this.playerNameFilterVisible = !this.playerNameFilterVisible;
    this.playerNameDialog.style = {position: 'absolute', top: event.pageY , left: event.pageX};
  }
}
