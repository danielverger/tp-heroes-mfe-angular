import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ]
})
export class ToolbarComponent {
  @Input() showSideNav!: boolean;
  @Output() showSideNavChange = new EventEmitter<boolean>();

  toggleMenu() {
    this.showSideNavChange.emit(!this.showSideNav);
  }
}
