import { TestBed } from '@angular/core/testing';

import { SupportedBrowserGuard } from './supported-browser.guard';

describe('SupportedBrowserGuard', () => {
  let guard: SupportedBrowserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SupportedBrowserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
