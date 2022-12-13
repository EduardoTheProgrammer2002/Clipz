import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleConvertion'
})
export class TitleConvertionPipe implements PipeTransform {

  transform(value: string) {
    console.log(value)
    const words = value.split(' ');
    if (value.length <= 30) {
      return value
    }

    const shortTitle = value.slice(0, 25) + '...';

    return shortTitle;
  }

}
