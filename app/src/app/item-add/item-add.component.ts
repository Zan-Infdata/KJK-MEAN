import { Component, OnInit} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';

import { Location } from '../shared/classes/location';
import { KjkDataService } from "../shared/services/kjk-data.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html'
})
export class ItemAddComponent implements OnInit{

  protected itemTypes!: any;
  protected message!: string;
  protected defLocations!: Location[];
  protected wasSubmitted: Boolean = false;

  itemForm = this.fb.group({
    itemName: [,Validators.required],
    itemQuantity: [0,[Validators.required,Validators.min(1)]],
    itemType: [-1,[Validators.required, Validators.min(0)]],
    itemCode: [,Validators.required],
    itemDesc: [''],
    itemWrh: [-1,Validators.min(0)]
  });


  constructor(
    private fb: FormBuilder,
    private dataService: KjkDataService,
    private router: Router
  ) 
  { 
    this.dataService.getItemTypes().subscribe((it) => this.itemTypes = it);
    this.defLocations = []
  }


  onSubmit() {
    
    this.wasSubmitted = true;
    if(this.itemForm.valid){
      
      this.dataService.addItem(this.itemForm.value).subscribe((_) => {});
      //TODO: IMPROVE THIS
      alert('Oprema '+ this.itemForm.controls['itemName'].value+ ' uspešno dodana.');
      this.reloadCurrentRoute();
  
     

    }
  }

  ngOnInit(): void {
    this.getDefaultWarehouses();
    
  }


  private getDefaultWarehouses = (): void => {
    this.message = "Getting all premanent locations...";
    this.dataService.getLocationsByType("permanent")
    .subscribe(locations => (this.defLocations = locations));
  }


  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }


}
