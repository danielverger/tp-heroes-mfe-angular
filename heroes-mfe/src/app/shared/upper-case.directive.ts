import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone:true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UpperCaseDirective),
      multi: true
    }
  ]
})

export class UpperCaseDirective implements ControlValueAccessor{
  onChange!: (value: string) => void;
  onTouched!: () => void;

  constructor(private el: ElementRef) { }

  @HostListener('input') onInput() {
    this.convertToUppercase();
    this.onChange(this.el.nativeElement.value);
    this.onTouched();
  }

  private convertToUppercase() {
    const currentValue = this.el.nativeElement.value;
    this.el.nativeElement.value = currentValue.toUpperCase();
  }

  writeValue(value: string): void {
    this.el.nativeElement.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
