import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../classes/item';

@Pipe({
  name: 'filterMyItems'
})
export class FilterMyItemsPipe implements PipeTransform {

  transform(items: Item[],uid: string, iteration: number): Item[] {
    const retItems: Item[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.taken) continue;
      let quantity = 0;
      let date = null;
      for (let j = 0; j < item.taken.length; j++) {
        const take = item.taken[j];
        if (!take.dateReturned && take.user == uid) {
          quantity += take.quantity;
          if (!date) date = take.dateTook;
        }
      }
      item.quantity = quantity;
      item.dateTaken = date || undefined;
      if (quantity > 0) retItems.push(item);
    }
    const e = iteration+4;

    return retItems;
  }

}
