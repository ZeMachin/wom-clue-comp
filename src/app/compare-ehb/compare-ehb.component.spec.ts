import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareEhbComponent } from './compare-ehb.component';

describe('CompareEhbComponent', () => {
  let component: CompareEhbComponent;
  let fixture: ComponentFixture<CompareEhbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompareEhbComponent]
    });
    fixture = TestBed.createComponent(CompareEhbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
