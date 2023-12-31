import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Activity, Boss, ComputedMetrics, Skill } from '../models/metric.model';
import { SelectItem, SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  form!: FormGroup;
  metricOptions: SelectItemGroup[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = fb.group(
      { 
        competitionId: [31221],
        metrics: fb.array([
          fb.group({name: ['vardorvis'], weight: [0.6]}),
          fb.group({name: ['duke_sucellus'], weight: [0.8]}),
          fb.group({name: ['the_leviathan'], weight:  [1]}),
          fb.group({name: ['the_whisperer'], weight: [1.15]}),
        ])  
      }
    );
    this.loadMetricOptions();
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

  getValuesFromEnum(enumList: any): SelectItem[] {
    return Object.values(enumList).filter((v) => typeof v === 'string') as SelectItem[];
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

  onSubmit() {
    this.navigateToCompetition(this.form.get('competitionId')?.value, this.form.get('metrics')?.value);
  }

  navigateToCompetition(competitionId: number, metrics?: {name: string, weight: number}[]) {
    const queryParams: any = {
      metrics: JSON.stringify(metrics),
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