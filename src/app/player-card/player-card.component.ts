import { Component, Input } from '@angular/core';
import { ClueGains, HiScore } from '../models/hiscore.model';
import { CLUE_WEIGHTS, DT2_WEIGHTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.less']
})
export class PlayerCardComponent {
  @Input('hiscore') hiscore!: HiScore;
  @Input('index') index!: number;

  CLUE_WEIGHTS = CLUE_WEIGHTS;
  DT2_WEIGHTS = DT2_WEIGHTS;
  expanded: boolean = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  keys(object: ClueGains): string[] {
    return Object.keys(object);
  }
}
