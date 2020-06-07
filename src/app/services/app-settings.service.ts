import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  constructor() { }

  public thowErrorsOnSave = false;
  public apiUrl = 'https://0f1c6e64.s3.amazonaws.com/addresses'; // 'http://localhost:4200/assets/addresses';
  public dummyUrl = 'http://nodomain.tech/noApi';
  public delayForDummyApi = 1000;

}
