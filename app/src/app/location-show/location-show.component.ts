import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {MatPaginator} from '@angular/material/paginator';

import { KjkDataService } from '../shared/services/kjk-data.service';

import { Item } from '../shared/classes/item';

import {MatTableDataSource} from '@angular/material/table';



@Component({
  selector: 'app-location-show',
  templateUrl: './location-show.component.html',
})
export class LocationShowComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  protected itemsOnLoc: any =[];
  protected displayedColumns = ['code', 'name', 'desc', 'quantity', 'btn'];

  protected location!: any;
  protected locId! : any;

  protected defLocations: any = [];
  protected itemsNumber: number = 0;

  protected wrhSelector = new FormControl(-1);

  constructor(
    private kjkDataService: KjkDataService,
    private route : ActivatedRoute,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.locId = this.route.snapshot.paramMap.get('locId');
    this.getDefaultWarehouses();
    this.kjkDataService.getLocationById(this.locId).subscribe(loc => {this.location = loc;
      this.location = this.location[0];
      this.getItemsOnLocation();
    });

  }


  applyFilter(filterValue: any) {
    filterValue = filterValue.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.itemsOnLoc.filter = filterValue;
  }



  private getItemsOnLocation = (): void => {
    if(this.location.locationType == "permanent"){
      this.kjkDataService.getAvailableItems(this.location._id).subscribe((items: Item[]) => {
        this.itemsNumber = items.length;
        this.itemsOnLoc = new MatTableDataSource(items);
        this.itemsOnLoc.paginator = this.paginator;
      });
    }
    else {
      this.kjkDataService.getItems().subscribe((items: Item[]) => {
        let dump = [];
  
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          item.quantity = 0;
          item.taken?.forEach(take => {

            if(!take.dateReturned && take.location == this.location._id){
              item.quantity += take.quantity;
            }

          });
          
          if(item.quantity != 0){
            dump.push(item);
            this.itemsNumber += 1;
          }
          
        }

        
        this.itemsOnLoc = new MatTableDataSource(dump);

        this.itemsOnLoc.paginator = this.paginator;
  
      })
    }

    

  }


  deleteLoc(): void {
    if(this.itemsNumber == 0){
      this.kjkDataService.deleteLocation(this.locId).subscribe();
      this.router.navigate(['locations']);
    }
  }

  

  deleteWrh(): void {
    if(this.itemsNumber == 0 || this.wrhSelector.value != -1){
      
      if(this.itemsNumber != 0){
        this.itemsOnLoc.filter = '';
        this.relocateItems(this.itemsOnLoc.filteredData);

      }

      this.kjkDataService.deleteLocation(this.locId).subscribe();
      this.router.navigate(['locations']);
    }
  }

  private getDefaultWarehouses = (): void => {
    this.kjkDataService.getLocationsByType("permanent")
    .subscribe(locations => (this.defLocations = locations));
  }

  private relocateItems(items: any){
    for(let i = 0; i < items.length; i++){

      let formOut = {
        code: items[i].code,
        defaultLocation: this.wrhSelector.value,
        description: items[i].description,
        itemType: items[i].itemType,
        name: items[i].name,
        quantity: items[i].quantity,
        taken: items[i].taken
      }

      this.kjkDataService.updateItem(items[i]._id, formOut).subscribe();

    }
  }

}
