import { TestBed } from '@angular/core/testing';

import { AddressApiService } from './address-api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptorMock } from 'src/test/http-request-interceptor.mock';
import { addressesResponse } from 'src/test/addresses.response';
import { ParseAddressService } from './parse-address.service';
import { Address } from '../models/address';


describe('AddressApiService', () => {
  let service: AddressApiService;
  let parseAddresService: ParseAddressService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpRequestInterceptorMock,
          multi: true
        },
        ParseAddressService
      ]
    });
    service = TestBed.inject(AddressApiService);
    parseAddresService = TestBed.inject(ParseAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the parsed addresses', (done) => {

    const parsedAddresses = parseAddresService.parseAddresses(addressesResponse);

    const addresses = service.getAddresses().subscribe(
      result => {

        // remove id properties because they are random
        result.forEach(element => {
          delete element.id;
        });
        parsedAddresses.forEach(element => {
          delete element.id;
        });
        expect(result).toEqual(parsedAddresses);
        done();
      }
    );

  });

  it('should update the address', (done) => {

    const anAddress = parseAddresService.parseAddresses(addressesResponse)[0];

    const addresses = service.updateAddress(anAddress).subscribe(
      result => {
        expect(result).toEqual(anAddress);
        done();
      }
    );

  });

  it('should insert an address', (done) => {

    const anAddress = parseAddresService.parseAddresses(addressesResponse)[0];
    anAddress.id = undefined;

    const addresses = service.addAddress(anAddress).subscribe(
      result => {
        expect(result.id).not.toBe(undefined);

        delete result.id;
        delete anAddress.id;

        expect(result).toEqual(anAddress);
        done();
      }
    );

  });


});
