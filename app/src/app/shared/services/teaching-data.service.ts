import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Geopoint } from '../classes/geopoint';

@Injectable({
  providedIn: 'root'
})
export class TeachingDataService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = "https://teaching.lavbic.net/api";

  public getCoordinates(address: string): Observable<Geopoint> {
    const url: string = `${this.apiUrl}/nominatim/search?q=${encodeURIComponent(address)}&limit=1&addressdetails=1&format=geojson`;
    return this.http
      .get<Geopoint>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      () => (error.error && error.error.message) || error.statusText
    );
  }
}
