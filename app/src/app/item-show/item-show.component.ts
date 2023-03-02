import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { FormBuilder, Validators} from '@angular/forms';

import { Location } from '../shared/classes/location';

import { KjkDataService } from '../shared/services/kjk-data.service';


@Component({
  selector: 'app-item-show',
  templateUrl: './item-show.component.html',
})
export class ItemShowComponent implements OnInit {

  protected itemTypes!: any;
  protected itmId!: any;
  protected item!: any;

  protected defLocations!: Location[];
  protected message!: string;

  protected itemForm!: any;
  
  protected wasSubmitted: Boolean = false;

  protected inWrh: boolean = true;


  constructor(
    private fb: FormBuilder,
    private kjkDataService: KjkDataService,
    private route : ActivatedRoute,
    private router: Router
  ) { 
    this.kjkDataService.getItemTypes().subscribe(((it) => this.itemTypes = it));
    this.defLocations = [];
  }

  ngOnInit(): void {

    this.getDefaultWarehouses();

    this.itmId = this.route.snapshot.paramMap.get('itmId');
    this.kjkDataService.getItemById(this.itmId).subscribe(loc => {this.item = loc;
      this.item = this.item[0];
      

      for(let i = 0; i < this.item.taken.length; i++){
        if(this.item.taken[i].dateReturned){
          this.inWrh = this.inWrh && true;
        }
        else{
          this.inWrh = false;
          this.item.quantity -= this.item.taken[i].quantity;
        }
      }

      this.itemForm = this.fb.group({
        itemName: [this.item.name, Validators.required],
        itemQuantity: [this.item.quantity,[Validators.required,Validators.min(1)]],
        itemType: [this.itemTypes.indexOf(this.item.itemType),[Validators.required, Validators.min(0)]],
        itemCode: [this.item.code,Validators.required],
        itemDesc: [this.item.description],
        itemWrh: [this.item.defaultLocation,Validators.min(0)]
      });


      if(!this.inWrh) {
        this.dissableForm();
      }

    });


  }


  onSubmit(): void {
    //TODO: ADD VALIDATION CHECK
    if(this.inWrh) {

      if(this.itemForm.valid){
        let form = this.itemForm.value
        let formOut = {
          code: form.itemCode,
          defaultLocation: form.itemWrh,
          description: form.itemDesc,
          itemType: this.itemTypes[form.itemType],
          name: form.itemName,
          quantity: form.itemQuantity,
          taken: this.item.taken
        }
        this.kjkDataService.updateItem(this.itmId, formOut).subscribe();
        alert('Oprema '+ this.itemForm.controls['itemName'].value+ ' uspešno posodobljena.');
        this.reloadCurrentRoute();
      }

    }
    else{
      alert("Za urejanje in brisanje opreme morajo biti vsi kosi opreme v skladišču");
    }
    
  }

  onDelete(): void {
    if(this.inWrh) {

      if(this.itemForm.valid){

        this.kjkDataService.deleteItem(this.itmId).subscribe();
        this.router.navigate(['items']);

      }

    }
    else{
      alert("Za urejanje in brisanje opreme morajo biti vsi kosi opreme v skladišču");
    }
    
  }


  private getDefaultWarehouses = (): void => {
    this.message = "Getting all premanent locations...";
    this.kjkDataService.getLocationsByType("permanent")
    .subscribe(locations => {this.defLocations = locations;});
  }

  dissableForm(){
    this.itemForm.controls['itemName'].disable();
    this.itemForm.controls['itemQuantity'].disable();
    this.itemForm.controls['itemType'].disable();
    this.itemForm.controls['itemCode'].disable();
    this.itemForm.controls['itemDesc'].disable();
    this.itemForm.controls['itemWrh'].disable();
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }



}
