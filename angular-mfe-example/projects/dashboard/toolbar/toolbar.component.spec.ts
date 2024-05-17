import { TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ]
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ToolbarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


});
