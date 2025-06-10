import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar',
  standalone: false
})
export class CapitalizarPipe implements PipeTransform {

  transform(value: unknown): unknown {
    if (typeof value !== 'string') {
      return value;
    }

    return value
      .toLowerCase()
      .replace(/\b\w/g, (first) => first.toUpperCase());
  }

}
