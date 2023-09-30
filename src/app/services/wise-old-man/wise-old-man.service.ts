import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompetitionDetails } from '../../models/competition.model';
import { firstValueFrom } from 'rxjs'
import { PlayerGains } from '../../models/player-gains.model';
import { PlayerDetails } from 'src/app/models/player.model';

const API_BASE = 'https://api.wiseoldman.net/v2';
const COMPETITION_API = '/competitions/:id';
const PLAYER_GAINS_API = '/players/:username/gained';
const PLAYER_UPDATE_API = '/players/:username';

@Injectable({
  providedIn: 'root'
})
export class WiseOldManService {
  constructor(private http: HttpClient) { }

  getCompetition(id: number, metric?: string): Promise<CompetitionDetails> {
    const options = metric ? {params: new HttpParams().set('metric', metric)} : {};
    const url = API_BASE + COMPETITION_API.replace(':id', id.toString());
    return firstValueFrom(this.http.get<CompetitionDetails>(url, options));
  }

  getPlayerDetails(playerName: string, startDate: string, endDate: string): Promise<PlayerGains> {
    const options = {params: new HttpParams().set('startDate', startDate).set('endDate', endDate)}
    const url = API_BASE + PLAYER_GAINS_API.replace(':username', playerName);
    return firstValueFrom(this.http.get<PlayerGains>(url, options));
  }

  updatePlayer(playerName: string): Promise<PlayerDetails> {
    const url = API_BASE + PLAYER_UPDATE_API.replace(':username', playerName); 
    return firstValueFrom(this.http.post<PlayerDetails>(url, {}));
  }
}
