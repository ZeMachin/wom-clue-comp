import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlayersModalComponent } from './update-players-modal.component';

describe('UpdatePlayersModalComponent', () => {
  let component: UpdatePlayersModalComponent;
  let fixture: ComponentFixture<UpdatePlayersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePlayersModalComponent]
    });
    fixture = TestBed.createComponent(UpdatePlayersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
