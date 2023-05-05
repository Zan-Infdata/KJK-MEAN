import { Inject, Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Location } from "../classes/location";
// import { Take } from "../classes/take";
import { Item } from "../classes/item";
import { environment } from "../../../environments/environment";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { BROWSER_STORAGE } from "../classes/storage";



@Injectable({
  providedIn: 'root'
})
export class KjkDataService {

  private itemTypes!: any;

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { 
    this.getItemTypes().subscribe(((it) => this.itemTypes = it));
  }

  public getItemTypes(): Observable<any> {
    const url = `${this.apiUrl}/item-types`;
    return this.http
    .get<any>(url)
    .pipe(retry(1), catchError(this.handleError))
  }


  private apiUrl = environment.apiUrl;

  public login(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }

  public register(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("register", user);
  }

  private makeAuthApiCall(
    urlPath: string,
    user: User
  ): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/${urlPath}`;
    let body = new HttpParams().set("email", user.email).set("name", user.name);
    if (user.password) body = body.set("password", user.password);
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post<AuthResponse>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  private authHeader(): HttpHeaders {
    return new HttpHeaders().set("Authorization", `Bearer ${this.storage.getItem("user-token")}`);
  }

  public getLocations(): Observable<Location[]> {
    const url: string = `${this.apiUrl}/locations`;
    console.log(url);
    const header = this.authHeader();
    return this.http
      .get<Location[]>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError)); 
  }

  public getLocationById(id: string): Observable<Location> {
    const url: string = `${this.apiUrl}/location/${id}`;
    const header = this.authHeader();
    return this.http
      .get<Location>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }


  public getLocationsByType(locType: String): Observable<Location[]> {
    const url: string = `${this.apiUrl}/locations/${locType}`;
    const header = this.authHeader();
    return this.http
      .get<Location[]>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public getItems(): Observable<Item[]> {
    const url: string = `${this.apiUrl}/items`;
    const header = this.authHeader();
    return this.http
      .get<Item[]>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public getAvailableItems(locationId: string): Observable<Item[]> {
    const url: string = `${this.apiUrl}/available-items/${locationId}`;
    const header = this.authHeader();
    return this.http
      .get<Item[]>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public takeItems(items: Item[], locationId: string): Observable<String> {
    const url: string = `${this.apiUrl}/items-take`;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.getItem("user-token")}`
    });
    return this.http
      .post<String>(url, { items: items, toLocation: locationId }, { 'headers': header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public returnItem(location: Location, item: Item): Observable<String> {
    const url: string = `${this.apiUrl}/item-return`;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.getItem("user-token")}`
    });
    return this.http
      .post<String>(url, { item: item, location: location }, { 'headers': header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public getMyItems(): Observable<Location[]> {
    const url: string = `${this.apiUrl}/my-items`;
    const header = this.authHeader();
    return this.http
      .get<Location[]>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      () => (error.error && error.error.message) || error.statusText
    );
  }

  public addLocation(location: any): Observable<Location> {
    const url: string = `${this.apiUrl}/location`;
    const body = {
      name: location.locName,
      location: location.locAddress,
      coordinates: [location.locLati, location.locLong],
      locationType: location.locIsDefault ? "permanent" : "temporary",
      description: location.locDesc
    };

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.getItem("user-token")}`
    });

    return this.http
      .post<Location>(url, body, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteLocation(id: string): Observable<any> {
    const url: string = `${this.apiUrl}/location/${id}`;
    const header = this.authHeader();
    return this.http
      .delete(url, { headers: header } )
      .pipe(retry(1), catchError(this.handleError));
  }

  public addItem(item: any): Observable<Item> {
    const url: string = `${this.apiUrl}/item`;
    const body = {
      name: item.itemName,
      code: item.itemCode,
      description: item.itemDesc,
      quantity: item.itemQuantity,
      taken: [],
      itemType: this.itemTypes[item.itemType],
      defaultLocation: item.itemWrh
    }
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storage.getItem("user-token")}`
    });
    return this.http
      .post<Item>(url, body, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }


  public getItemById(id: string): Observable<Item> {
    const url: string = `${this.apiUrl}/item/${id}`;
    const header = this.authHeader();
    return this.http
      .get<Item>(url, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }

  public updateItem(id: string, updatedItem: any): Observable<Item> {
    const url: string = `${this.apiUrl}/item/${id}`;
    const body = updatedItem;
    const header = this.authHeader();
    return this.http
      .put<Item>(url, body, { headers: header })
      .pipe(retry(1), catchError(this.handleError));
  }


  public deleteItem(id: string): Observable<any> {
    const url: string = `${this.apiUrl}/item/${id}`;
    const header = this.authHeader();
    return this.http
      .delete(url, { headers: header } )
      .pipe(retry(1), catchError(this.handleError));
  }

  

}
