import { Component } from '@angular/core';

import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    SidenavComponent,
    ToolbarComponent,
  ]
})
export class DashboardComponent {
  showSideNav = true;
}
