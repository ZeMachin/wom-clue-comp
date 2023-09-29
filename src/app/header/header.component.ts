import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {
  competitionName = 'Trailer Boys Competition';

  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/home']);
  }
}
