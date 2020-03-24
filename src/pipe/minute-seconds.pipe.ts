import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    if (minutes >= 1) {
      return minutes.toString().padStart(2, '0') + 'h' +
        (value - minutes * 60).toString().padStart(2, '0');
    } else {
      if (((value - minutes * 60).toString().padStart(2, '0')) === '00') {
        return '-';
      } else {
        return (value - minutes * 60).toString().padStart(2, '0') + ' min';
      }
    }
  }

}
