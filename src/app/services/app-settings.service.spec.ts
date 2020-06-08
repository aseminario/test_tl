import { TestBed } from '@angular/core/testing';

import { AppSettingsService } from './app-settings.service';

describe('AppSettingsService', () => {
  let service: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be the correct value', () => {
    expect(service.apiUrl).toBe('https://0f1c6e64.s3.amazonaws.com/addresses');
  });
});
