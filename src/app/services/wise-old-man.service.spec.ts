import { TestBed } from '@angular/core/testing';

import { WiseOldManService } from './wise-old-man.service';

describe('WiseOldManService', () => {
  let service: WiseOldManService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WiseOldManService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
