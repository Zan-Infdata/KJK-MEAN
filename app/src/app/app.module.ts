import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { registerLocaleData } from '@angular/common';
import localeSl from "@angular/common/locales/sl"
registerLocaleData(localeSl);

import { ReactiveFormsModule } from '@angular/forms';
 
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FrameworkComponent } from './framework/framework.component';
import { AboutComponent } from './about/about.component';
import { LocationListComponent } from './location-list/location-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { LocationAddComponent } from './location-add/location-add.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemTakeComponent } from './item-take/item-take.component';
import { MyItemsComponent } from './my-items/my-items.component';
import { FilterMyItemsPipe } from './shared/pipes/filter-my-items.pipe';
import { LocationShowComponent } from './location-show/location-show.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ItemShowComponent } from './item-show/item-show.component';

const routes: Routes = [
  { path: "", component: AboutComponent, data: { title: "Kje je kaj?", subtitle: "To je uradna aplikacija projekta Kje je kaj?" } },
  { path: "locations", component: LocationListComponent, data: { title: "Stanje po lokacijah", subtitle: "Preglej koliko opreme je na lokaciji" } },
  { path: "items", component: ItemListComponent, data: { title: "Seznam opreme", subtitle: "Oglej si seznam opreme in ga po potrebi dopolni/popravi" } },
  { path: "location-add", component: LocationAddComponent, data: { title: "Dodajanje lokacije", subtitle: "Dodaj novo lokacijo" } },
  { path: "item-add", component: ItemAddComponent, data: { title: "Dodajanje opreme", subtitle: "Dodaj novo opremo" } },
  { path: "item-take", component: ItemTakeComponent, data: { title: "Vzemi opremo", subtitle: "Izberi trenutno, nato ciljno lokacijo, potem pa pokljukaj želeno opremo." } },
  { path: "my-items", component: MyItemsComponent, data: { title: "Moja oprema", subtitle: "Preglej svojo izposojeno opremo in jo vrni" } },
  { path: "location-show/:locId", component: LocationShowComponent, data: { title: "Ogled lokacije", subtitle: "Preglej opremo na izbrani lokaciji" } },
  { path: "register", component: RegisterComponent, data: { title: "Registracija", subtitle: "Registriraj se v sistem, da bomo lažje sledili kdo ima kaj" } },
  { path: "login", component: LoginComponent, data: { title: "Prijava", subtitle: "Prijavi se v sistem, da bomo lažje sledili kdo ima kaj" } },
  { path: "item-show/:itmId", component: ItemShowComponent, data: { title: "Urejanje opreme", subtitle: "Uredi izbrani kos opreme" } }
];

@NgModule({
  declarations: [
    FrameworkComponent,
    AboutComponent,
    LocationListComponent,
    ItemListComponent,
    LocationAddComponent,
    ItemAddComponent,
    ItemTakeComponent,
    MyItemsComponent,
    FilterMyItemsPipe,
    LocationShowComponent,
    RegisterComponent,
    LoginComponent,
    ItemShowComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "sl" },
  ],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }
