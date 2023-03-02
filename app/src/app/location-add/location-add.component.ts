import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { KjkDataService } from "../shared/services/kjk-data.service";
import { TeachingDataService } from '../shared/services/teaching-data.service';
import { Router } from '@angular/router';
import { Geopoint } from '../shared/classes/geopoint';


@Component({
  selector: 'app-location-add',
  templateUrl: './location-add.component.html'
})
export class LocationAddComponent implements OnInit{

  protected wasSubmitted = false;
  protected coordinatesError = '';

  locationForm = this.fb.group({
    locName : [,Validators.required],
    locAddress : [,Validators.required],
    locDesc: [''],
    locLati : [0,[Validators.min(-90),Validators.max(90)]],
    locLong : [0,[Validators.min(-180),Validators.max(180)]],
    locIsDefault : [false]
  });

  constructor(
    private fb: FormBuilder, 
    private dataService: KjkDataService, 
    private tDataService: TeachingDataService, 
    private router: Router
  ) { router.onSameUrlNavigation = 'reload';}

  onSubmit() {
    this.wasSubmitted = true;

    if(this.locationForm.valid){
      
      this.dataService.addLocation(this.locationForm.value).subscribe((_) => {});
      //TODO: IMPROVE THIS
      alert('Lokacija '+ this.locationForm.controls['locName'].value+ ' uspešno dodana.');
      this.reloadCurrentRoute();

    }


  }

  ngOnInit(): void {
    
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  public addressToCoord() {
    this.coordinatesError = "";
    this.tDataService.getCoordinates(this.locationForm.controls['locAddress'].value || '').subscribe((geo: Geopoint) => {
      if (geo.features.length > 0) {
        const c = geo.features[0].geometry.coordinates;
        this.locationForm.controls['locLati'].setValue(c[1]);
        this.locationForm.controls['locLong'].setValue(c[0]);
      } else {
        this.coordinatesError = "Za podani naslov ni bilo mogoče najti koordinat.";
      }
    })
  }


}
