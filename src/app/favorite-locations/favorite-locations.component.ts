import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-favorite-locations',
  templateUrl: './favorite-locations.component.html',
  styleUrls: ['./favorite-locations.component.css'],
})
export class FavoriteLocationsComponent {
  @Input() favoriteLocations: Array<{ _id: string, name: string, coordinates: { lat: number, lon: number } }> = [];
  @Output() locationDeleted = new EventEmitter<string>();
  @Output() locationClicked = new EventEmitter<string>();

  // Emits the clicked location name
  onLocationClick(location: string) {
    this.locationClicked.emit(location);
  }

  // Emits the deleted location name
  onDelete(location: string) {
    this.locationDeleted.emit(location);
  }
}
