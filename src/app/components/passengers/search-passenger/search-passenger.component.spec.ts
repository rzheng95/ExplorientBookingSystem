import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPassengerComponent } from './search-passenger.component';

describe('SearchPassengerComponent', () => {
  let component: SearchPassengerComponent;
  let fixture: ComponentFixture<SearchPassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPassengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
