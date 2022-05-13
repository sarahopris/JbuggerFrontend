import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBugFormComponent } from './edit-bug-form.component';

describe('EditBugFormComponent', () => {
  let component: EditBugFormComponent;
  let fixture: ComponentFixture<EditBugFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBugFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
