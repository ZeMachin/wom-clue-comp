import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
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
    console.log('submitting')
  }
}
