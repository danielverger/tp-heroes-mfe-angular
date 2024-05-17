import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UpperCaseDirective } from './upper-case.directive';

@Component({
  template: ` <input id="name" appUppercase/>`,
})
class TestComponent {}

describe('UpperCaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [UpperCaseDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges(); 
  })

  it('should convert the input text to uppercase', () => {
    const input = fixture.debugElement.query(By.directive(UpperCaseDirective));
    input.nativeElement.value = 'test uppercase'
    input.triggerEventHandler('input', { target: input.nativeElement });
    fixture.detectChanges();
    expect(input.nativeElement.value).toEqual('TEST UPPERCASE');
  });
});



