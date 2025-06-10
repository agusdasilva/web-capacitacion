import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]',
  standalone: false
})
export class SoloNumerosDirective {
  private readonly regex = /^[0-9]*$/;
  private readonly specialKeys = new Set([
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Delete'
  ]);

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.specialKeys.has(event.key)) {
      return;
    }
    const current: string = (event.target as HTMLInputElement).value;
    const next: string = current.concat(event.key);
    if (!this.regex.test(next)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedInput: string = event.clipboardData?.getData('text') ?? '';
    if (!this.regex.test(pastedInput)) {
      event.preventDefault();
    }
  }
}
