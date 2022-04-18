import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson'
})
export class PrettyJsonPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return JSON.stringify(value, null, 2)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br/>');
    }
  }

}
