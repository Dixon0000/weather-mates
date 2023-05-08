import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-favorite-locations-page',
  templateUrl: './favorite-locations-page.component.html',
  styleUrls: ['./favorite-locations-page.component.css']
})
export class FavoriteLocationsPageComponent implements OnInit {
  favoriteLocations: Array<{ _id: string, name: string, coordinates: { lat: number, lon: number } }> = [];
  locationHistory: Array<{ _id: string, name: string, coordinates: { lat: number, lon: number } }> = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private locationService: LocationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.locationService.getFavoriteLocations().subscribe(
      (locations) => {
        this.favoriteLocations = locations;
      },
      (error: Error) => {
        console.error('Error fetching favorite locations:', error);
        this.snackBar.open('Error fetching favorite locations, please try again.', '', {
          duration: 3000,
          panelClass: 'centered-snackbar',
        });
      }
    );
    this.locationHistory = JSON.parse(localStorage.getItem('locationHistory') || '[]');
  }

  onLocationClicked(location: string) {
    this.addToLocationHistory(location);
    this.router.navigate([''], { queryParams: { location } });
  }

  
  
  addToLocationHistory(location: string): void {
    const existingLocationIndex = this.locationHistory.findIndex(loc => loc.name === location);
  
    // If the location is already in the history, remove it to prevent duplicates.
    if (existingLocationIndex > -1) {
      this.locationHistory.splice(existingLocationIndex, 1);
    }
  
    // If there are already 7 items in the history, remove the oldest one.
    if (this.locationHistory.length >= 7) {
      this.locationHistory.shift();
    }
  
    // Add the new location to the history.
    const locationToAdd = this.favoriteLocations.find(loc => loc.name === location);
    if (locationToAdd) {
      this.locationHistory.push(locationToAdd);
    }
  
    // Save the updated history to local storage.
    localStorage.setItem('locationHistory', JSON.stringify(this.locationHistory));
  }
  
  onLocationDeleted(location: string) {
    this.openConfirmationDialog(location);
  }  

  onDelete(location: string) {
    const locationToDelete = this.favoriteLocations.find((loc) => loc.name === location);

    if (locationToDelete) {
      this.locationService.deleteLocation(locationToDelete._id).subscribe(
        () => {
          this.snackBar.open('Location removed from favorites.', '', {
            duration: 3000,
            panelClass: 'centered-snackbar',
          });
          // Remove the location from the local list
          this.favoriteLocations = this.favoriteLocations.filter((loc) => loc.name !== location);
        },
        (error: Error) => {
          console.error('Error deleting location:', error);
          this.snackBar.open('Error deleting location, please try again.', '', {
            duration: 3000,
            panelClass: 'centered-snackbar',
          });
        }
      );
    } else {
      console.error('Location not found in the favorite locations array');
    }
  }

  onLocationAddedToFavorites(newLocation: {_id: string, name: string, coordinates: { lat: number, lon: number } }) {
    // Check if the location already exists in the favoriteLocations array
    const locationExists = this.favoriteLocations.some(loc => loc.name === newLocation.name);
    if (!locationExists) {
    this.favoriteLocations.push(newLocation);
    } else {
    // Show a message to inform the user that the location is already in the favorites list
    this.snackBar.open('This location is already in your favorites.', '', {
    duration: 3000,
    panelClass: 'centered-snackbar',
    });
    }
    }
    
    openConfirmationDialog(location: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '350px',
    });
    dialogRef.afterClosed().subscribe((result) => {
    if (result) {
    this.onDelete(location);
    }
    });
    }
    }
