import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CompetitionComponent } from './competition/competition.component';
import { CompareEhbComponent } from './compare-ehb/compare-ehb.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'competition', component: CompetitionComponent },
  { path: 'compare-ehb', component: CompareEhbComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
