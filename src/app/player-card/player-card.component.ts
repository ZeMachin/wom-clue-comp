import { Component, Input } from '@angular/core';
import { HiScore } from '../models/hiscore.model';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.less']
})
export class PlayerCardComponent {
  @Input('hiscore') hiscore!: HiScore;
  @Input('index') index!: number;

  expanded: boolean = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  keys(object: any): string[] {
    return Object.keys(object);
  }
}
