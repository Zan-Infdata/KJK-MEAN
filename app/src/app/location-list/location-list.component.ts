import { Component, OnInit } from '@angular/core';
import { Location } from '../shared/classes/location';
import { KjkDataService } from "../shared/services/kjk-data.service";

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html'
})
export class LocationListComponent implements OnInit {

  protected numberOfItems: any = [];

  constructor(
    private dataService: KjkDataService,
  ) {}

  ngOnInit(): void {
    this.getAllLocations();
  }
  

  protected message!: string;
  protected locations!: any[];


  private getAllLocations = (): void => {
    this.message = "Getting all locations...";
    this.dataService.getLocations()
    .subscribe(locations => {
      this.locations = locations.sort(this.permFirst);

      

      for(let i=0; i < this.locations.length; i++) {
        

        if(this.locations[i].locationType == "temporary"){
          this.locations[i].numberOfItems = this.locations[i].items.length;
          
          
        }
        else {
          this.dataService.getAvailableItems(this.locations[i]._id).subscribe(items => {this.locations[i].numberOfItems = items.length});
        }
        
      }


    });
    
  };


  private permFirst( a: any, b: any ) {
    if ( a.locationType < b.locationType ){
      return -1;
    }
    if ( a.locationType > b.locationType ){
      return 1;
    }
    return 0;
  }


}
