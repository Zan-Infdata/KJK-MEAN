import { Component, OnInit } from '@angular/core';
import { KjkDataService } from '../shared/services/kjk-data.service';
import { Location } from '../shared/classes/location';
import { Item } from '../shared/classes/item';
import { AuthenticationService } from "../shared/services/authentication.service";

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html'
})
export class MyItemsComponent implements OnInit {

  constructor(
    private dataService: KjkDataService,
    private authenticationService: AuthenticationService
  ) { }

  protected myItems: Location[] = [];
  protected iteration: number = 0;

  ngOnInit(): void {
    this.getMyItems();
  }

  private getMyItems = (): void => {
    this.dataService.getMyItems().subscribe((myItems) => {
      this.myItems = myItems;
    })
  }

  returnItem(location: Location, item: Item): void {
    this.dataService.returnItem(location, item).subscribe((_) => {
      for (let i = 0; i < this.myItems.length; i++) {
        const loc = this.myItems[i];
        if (loc._id == location._id) {
          for (let j = 0; j < loc.items.length; j++) {
            const itm = loc.items[j];
            if (itm._id == item._id) {
              itm.quantity--;
              if (itm.quantity == 0) {
                loc.items.splice(j, 1);
              } else if (itm.taken) {
                for (let k = 0; k < itm.taken.length; k++) {
                  const take = itm.taken[k];
                  if (!take.dateReturned && take.user == this.myUserId()) {
                    take.quantity--;
                    if (take.quantity == 0) {
                      take.dateReturned = new Date();
                    }
                  }
                }
              }
              this.iteration++;
              return;
            }
          }
        }
      }
    })
  }

  public myUserId(): string {
    return this.authenticationService.getCurrentUser()?._id || '';
  }
}
