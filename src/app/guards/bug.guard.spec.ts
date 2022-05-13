import { TestBed } from '@angular/core/testing';

import { BugGuard } from './bug.guard';

describe('BugGuard', () => {
  let guard: BugGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BugGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
