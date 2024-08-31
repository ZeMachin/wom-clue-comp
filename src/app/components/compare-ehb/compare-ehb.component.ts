import { Component, OnInit } from '@angular/core';
import { Player, PlayerDetails } from '../../models/player.model';
import { WiseOldManService } from '../../services/wise-old-man/wise-old-man.service';

@Component({
  selector: 'app-compare-ehb',
  templateUrl: './compare-ehb.component.html',
  styleUrls: ['./compare-ehb.component.less']
})
export class CompareEhbComponent implements OnInit {
  displayStats = false;
  loading = false;
  newTeamName: string = '';
  newTeamMemberName: string = '';

  teams: Team[] = [];

  constructor(private WOMService: WiseOldManService) {}

  ngOnInit(): void {
    const teams = localStorage.getItem('teams');
    if(teams) this.teams = JSON.parse(teams);
  }

  onAddNewTeam() {
    this.teams.push(new Team(this.newTeamName));
    this.newTeamName = '';
    this.saveTeams();
  }

  onDeleteTeam(team: Team) {
    this.teams = this.teams.filter((t) => t != team);
    this.saveTeams();
  }

  onAddNewTeamMember(team: Team, event?: any) {
    if(event) {
      team.members.push(event.target.value);
      event.target.value = '';
    } 
    this.saveTeams();
  }

  saveTeams() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }

  async onDisplayStats() {
    this.loading = true;
    this.displayStats = !this.displayStats;
    if(this.displayStats) {
      for(const team of this.teams) {
        team.players = [];
        for(const member of team.members)
          team.players.push(await this.WOMService.getPlayerDetails(member));
      }
    }
    this.loading = false;
  }

  teamsHavePlayers(): boolean {
    return this.teams.filter((t) => t.players && t.players.length !== 0).length !== 0;
  }

  getTotalTeamEHB(team: Team) {
    team = new Team(team.name, team.members, team.players);
    return team.totalEHB;
  }

  saveMember(team: Team, member: string, event: any) {
   const index = team.members.indexOf(member);
   if(index != -1) team.members[index] = event.target.value;
   this.saveTeams();
  }
}

class Team {
  constructor(name: string, members: string[] = [], players?: PlayerDetails[]) {
    this.name = name;
    this.members = members;
    this.players = players;
  }
  name: string = '';
  members: string[] = [];
  players?: PlayerDetails[];

  get totalEHB(): number {
    return this.players?.map((p) => p.ehb).reduce((a, b) => a + b) ?? 0;
  }

  getTotalEHB(): number {
    return this.players?.map((p) => p.ehb).reduce((a, b) => a + b) ?? 0;
  }
}


