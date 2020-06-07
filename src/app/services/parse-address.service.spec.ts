import { TestBed } from '@angular/core/testing';

import { ParseAddressService } from './parse-address.service';

describe('ParseAddressService', () => {
  let service: ParseAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse 2 addresses', () => {
    const addresses = `12357 Glen Iris Drive NE, Sandy Sprints, FL 30327
2857 Jesse Hill Jr Street, Decatur, GA 30354
9007199254740992 Auburn Avenue, Sandy Sprints, FL 30301`

    var result = service.parseAddresses(addresses);

    expect(result.length).toBe(3);

    expect(result[0].streetNumber).toBe('12357');
    expect(result[0].street).toBe('Glen Iris Drive NE');
    expect(result[0].city).toBe('Sandy Sprints');
    expect(result[0].state).toBe('FL');
    expect(result[0].zip).toBe('30327');

    expect(result[1].streetNumber).toBe('2857');
    expect(result[1].street).toBe('Jesse Hill Jr Street');
    expect(result[1].city).toBe('Decatur');
    expect(result[1].state).toBe('GA');
    expect(result[1].zip).toBe('30354');

    expect(result[2].streetNumber).toBe('9007199254740992');
    expect(result[2].street).toBe('Auburn Avenue');
    expect(result[2].city).toBe('Sandy Sprints');
    expect(result[2].state).toBe('FL');
    expect(result[2].zip).toBe('30301');

  });
});
