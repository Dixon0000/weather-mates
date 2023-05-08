import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteLocationsPageComponent } from './favorite-locations-page.component';

describe('FavoriteLocationsPageComponent', () => {
  let component: FavoriteLocationsPageComponent;
  let fixture: ComponentFixture<FavoriteLocationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteLocationsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteLocationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
