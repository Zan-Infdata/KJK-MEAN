import { Component, OnInit } from '@angular/core';
import { Location } from '../shared/classes/location';
import { Item } from '../shared/classes/item';
import { KjkDataService } from '../shared/services/kjk-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-take',
  templateUrl: './item-take.component.html'
})
export class ItemTakeComponent implements OnInit {

  constructor(
    private dataService: KjkDataService,
    private router: Router
  ) { }

  protected pLocations : Location[] = [];
  protected tLocations : Location[] = [];

  protected currentLocation = null;
  protected toLocation = null;

  protected availableItems : Item[] = [];
  protected takeItems: Item[] = [];

  ngOnInit(): void {
    this.getLocationOptions();
  }

  private getLocationOptions = (): void => {
    this.dataService.getLocationsByType("permanent").subscribe(locations => {
      this.pLocations = locations;
    });
    this.dataService.getLocationsByType("temporary").subscribe(locations => {
      this.tLocations = locations;
    });
  };

  getAvailableItems = (location: any) : void => {
    this.currentLocation = location;
    if (!location) return;
    this.dataService.getAvailableItems(location).subscribe(items => this.availableItems = items);
  }

  takeItem = (itemId: string) : void => {
    let item : Item | null = null;
    let i = 0;
    for (i = 0; i < this.availableItems.length; i++) {
      const itm = this.availableItems[i];
      if (itm._id == itemId) {
        item = itm;
        break;
      }
    }

    if (item && item.quantity > 0) {
      item.quantity--;
      if (item.quantity == 0) this.availableItems.splice(i,1);
      for (let k = 0; k < this.takeItems.length; k++) {
        const tItem = this.takeItems[k];
        if (tItem._id == itemId) {
          tItem.quantity++;
          return;
        }
      }
      const tItem = new Item(item._id,item.itemType,item.code,item.name,1,item.defaultLocation);
      this.takeItems.push(tItem);
    }
  }

  returnItem = (itemId: string) : void => {
    let item : Item | null = null;
    let i = 0;
    for (i = 0; i < this.takeItems.length; i++) {
      const itm = this.takeItems[i];
      if (itm._id == itemId) {
        item = itm;
        break;
      }
    }

    if (item && item.quantity > 0) {
      item.quantity--;
      if (item.quantity == 0) this.takeItems.splice(i,1);
      for (let k = 0; k < this.availableItems.length; k++) {
        const tItem = this.availableItems[k];
        if (tItem._id == itemId) {
          tItem.quantity++;
          return;
        }
      }
      const tItem = new Item(item._id,item.itemType,item.code,item.name,1,item.defaultLocation);
      this.availableItems.push(tItem);
    }
  }

  saveTakeItems = () : void => {
    if (this.toLocation) {
      this.dataService.takeItems(this.takeItems,this.toLocation).subscribe((_) => {
        this.router.navigate(['my-items']);
      });
    }
  }

}
