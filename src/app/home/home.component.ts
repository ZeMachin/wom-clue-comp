import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Activity, Boss, ComputedMetrics, Skill } from '../models/metric.model';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { PlayerType } from '../models/player.model';
import { Bracket } from '../models/bracket.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  form!: FormGroup;
  metricOptions: SelectItemGroup[] = [];
  playerTypeOptions: SelectItem[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = fb.group(
      { 
        competitionId: [63053],
        metrics: fb.array([
          fb.group({name: ['slayer'], weight: [0.001]}),
          fb.group({name: ['grotesque_guardians'], weight: [2.08]}),
          fb.group({name: ['abyssal_sire'], weight: [2]}),
          fb.group({name: ['kraken'], weight: [1.2]}),
          fb.group({name: ['cerberus'], weight: [0.96]}),
          fb.group({name: ['araxxor'], weight: [1.43]}),
          fb.group({name: ['thermonuclear_smoke_devil'], weight:  [0.625]}),
          fb.group({name: ['alchemical_hydra'], weight: [2]}),
        ]),
        brackets: fb.array([
          fb.group({
            playerTypes: [[]],
            metric: ['slayer'],
            higherBoundary: 0,
            lowerBoundary: 95
          }),
          fb.group({
            playerTypes: [[]],
            metric: ['slayer'],
            higherBoundary: 95,
            lowerBoundary: 75
          }),
          fb.group({
            playerTypes: [[]],
            metric: ['slayer'],
            higherBoundary: 75,
            lowerBoundary: 0
          })
        ])
      }
    );
    this.loadMetricOptions();
    this.loadPlayerTypeOptions();
  }

  loadMetricOptions() {
    this.metricOptions = [
      {
        label: 'Skills',
        items: this.getValuesFromEnum(Skill),
      },
      {
        label: 'Activities',
        items: this.getValuesFromEnum(Activity),
      },
      {
        label: 'Bosses',
        items: this.getValuesFromEnum(Boss),
      },
      { 
        label: 'Computed Metrics',
        items: this.getValuesFromEnum(ComputedMetrics),
      }
    ]
  }

  loadPlayerTypeOptions() {
    this.playerTypeOptions = this.getValuesFromEnum(PlayerType);
  }

  getValuesFromEnum(enumList: any): SelectItem[] {
    return Object.values(enumList).filter((v) => typeof v === 'string') as unknown as SelectItem[];
  }

  get metrics() {
    return this.form.get('metrics') as FormArray;
  }

  onAddMetric() {
    const metricForm = this.fb.group({
      name: [''],
      weight: [1]
    });

    this.metrics.push(metricForm);
  }

  onDeleteMetric(index: number) {
    this.metrics.removeAt(index);
  }

  get brackets() {
    return this.form.get('brackets') as FormArray;
  }

  onAddBracket() {
    const bracketForm = this.fb.group({
      playerTypes: [],
      metric: [''],
      higherBoundary: 0,
      lowerBoundary: 0
    });

    this.brackets.push(bracketForm);
  }

  onDeleteBracket(index: number) {
    this.brackets.removeAt(index);
  }

  onSubmit() {
    this.navigateToCompetition(this.form.get('competitionId')?.value, { metrics: this.metrics.value, brackets: this.brackets.value });
  }

  navigateToCompetition(competitionId: number, options?: {metrics?: { name: string, weight: number }[], brackets?: Bracket[]}) {
    const queryParams: any = {
      brackets: JSON.stringify(options?.brackets),
      metrics: JSON.stringify(options?.metrics),
      competitionId: competitionId
    };

    const navigationExtras: NavigationExtras = {
      queryParams
    };

    this.router.navigate(['/competition'], navigationExtras);
  }

  formatTitle(title: string): string {
    return title.split('_').map((w) => this.capitalize(w)).reduce((w1, w2) => w1 + ' ' + w2);
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  onFilter($event: any) {
    console.log('event:', $event);
  }
}