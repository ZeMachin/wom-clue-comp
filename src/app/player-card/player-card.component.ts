import { Component, Input } from '@angular/core';
import { Gains, HiScore } from '../models/hiscore.model';
import { CLUE_WEIGHTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.less']
})
export class PlayerCardComponent {
  @Input('hiscore') hiscore!: HiScore;
  @Input('index') index!: number;

  CLUE_WEIGHTS = CLUE_WEIGHTS;
  expanded: boolean = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  keys(object: Gains): string[] {
    return Object.keys(object);
  }
}
