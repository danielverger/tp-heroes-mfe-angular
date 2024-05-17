import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, Input } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterModule,
    CommonModule
  ]
})
export class SidenavComponent {
  @Input() showSideNav!: boolean;
  
  public menuList = [
    {name: 'Heroes', route: 'heroes'},
  ];

}
