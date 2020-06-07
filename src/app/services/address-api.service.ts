import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, take, delay, switchMapTo } from 'rxjs/operators';
import { throwError, Observable, of, interval } from 'rxjs';
import { Address } from '../models/address';
import { ParseAddressService } from './parse-address.service';
import { v4 as uuidv4 } from 'uuid';
import { AppSettingsService } from './app-settings.service';


@Injectable({
  providedIn: 'root'
})
export class AddressApiService {

  constructor(
    private httpClient: HttpClient,
    private parseAddressService: ParseAddressService,
    private appSettings: AppSettingsService
  ) { }

  public getAddresses(): Observable<Address[]> {
    return this.httpClient.get(
      this.appSettings.apiUrl + '.txt',
      {responseType: 'text'}
      )
      .pipe(
        map<string, Address[]>((res, index) => {
          return this.parseAddressService.parseAddresses(res);
        }),
      catchError(err => this.handleError(err))
    );
  }

  public updateAddress(address: Address): Observable<Address> {

    return this.httpClient.put(this.appSettings.dummyUrl, address).pipe(
      // this cathError is to simulate a OK result or an error result
      // because we don't have a restful endpoint.
      catchError<any,Observable<Address>>(err => {
        if (this.appSettings.thowErrorsOnSave){
          return throwError(err);
        } else {
          return of(address);
        }

      }),
      delay(this.appSettings.delayForDummyApi), // delay to simulate latency of a rest API
      catchError(err => this.handleError(err))
    );


  }

  public deleteAddress(address: Address): Observable<boolean> {
    return this.httpClient.delete(this.appSettings.dummyUrl,{}).pipe(
      // this cathError is to simulate a OK result or an error result
      // because we don't have a restful endpoint.
      catchError<any,Observable<boolean>>(err => {
        if (this.appSettings.thowErrorsOnSave){
          return throwError(err);
        } else {
          return of(true);
        }

      }),
      delay(this.appSettings.delayForDummyApi), // delay to simulate latency of a rest API
      catchError(err => this.handleError(err))
    );
  }

  public addAddress(address: Address): Observable<Address> {
    return this.httpClient.post(this.appSettings.dummyUrl,address).pipe(
      // this cathError is to simulate a OK result or an error result
      // because we don't have a restful endpoint.
      catchError<any,Observable<Address>>(err => {
        if (this.appSettings.thowErrorsOnSave){
          return throwError(err);
        } else {
          address.id = uuidv4();
          return of(address);
        }

      }),
      delay(this.appSettings.delayForDummyApi), // delay to simulate latency of a rest API
      catchError(err => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('handleError', error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `, error.error);

    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }



}

