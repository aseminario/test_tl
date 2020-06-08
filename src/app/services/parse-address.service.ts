import { Injectable } from '@angular/core';
import { Address } from '../models/address';
import { v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ParseAddressService {

  constructor() { }


  public parseAddresses(file: string): Address[] {
    const lines = file.split('\n');
    const addresses: Address[] = [];
    lines.forEach((element, index) => {
      const parts = element.split(',');
      if (parts.length !== 3) {
        throw Error(`Invalid line - is less than 2 commas or more than 2 commas: ${element}`);
      }
      const address = {
        id: uuidv4(),
        streetNumber: '',
        street: '',
        city: '',
        zip: '',
        state: ''
      };

      this.parseStreetNumberAndStreet(parts[0], address);
      address.city = parts[1].trim();
      this.parseStateAndZip(parts[2], address);
      addresses.push(address);
    });

    return addresses;
  }

  private parseStreetNumberAndStreet(value: string, address: Address) {
    const parts = value.trim().split(' ');
    if (parts.length < 2) {
      throw Error(`Invalid street number/street section: ${value}`);
    }
    address.streetNumber = parts.shift();
    address.street = parts.join(' ');
  }
  private parseStateAndZip(value: string, address: Address): void {
    const parts = value.trim().split(' ');
    if (parts.length !== 2) {
      throw Error(`Invalid state/zip section: ${value}`);
    }
    address.state = parts[0];
    address.zip = parts[1];
  }

}
