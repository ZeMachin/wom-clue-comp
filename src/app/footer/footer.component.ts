import { Component } from '@angular/core';
import { getYear } from 'date-fns';
import packageInfo from 'package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  year = getYear(new Date());
  version = packageInfo.version;
}
