import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBugFormComponent } from './new-bug-form.component';

describe('NewBugFormComponent', () => {
  let component: NewBugFormComponent;
  let fixture: ComponentFixture<NewBugFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBugFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
