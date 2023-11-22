import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'customSlice', pure: true })
export class CustomSlicePipe implements PipeTransform {

  transform(description: string, size: number): string {
    if (description.length > size) {
      return description.slice(0, size);
    } else {
      return description;
    }
  }

}
