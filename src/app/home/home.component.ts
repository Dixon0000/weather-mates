import { Component, ViewChild, OnInit } from '@angular/core';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { WeatherService } from '../weather.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentWeather: any;
  forecast: any;
  favoriteLocations: string[] = [];

  @ViewChild('locationSearchComponent', { static: false })
  locationSearchComponent!: LocationSearchComponent;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const location = params['location'];
      if (location) {
        this.onLocationSelected(location);
      }
    });
    this.loadFavoriteLocations();
  }

  onLocationSelected(location: string) {
    this.getWeatherData(location).subscribe((data) => {
      if (data) {
        this.currentWeather = data.currentWeather;
        this.forecast = data.forecast;
      }
    });
    this.saveLocationToHistory(location);
  }

  onCurrentWeatherReceived(data: any) {
    this.currentWeather = data;
  }

  onForecastReceived(data: any) {
    this.forecast = data;
  }

  onLocationAddedToFavorites() {
    this.snackBar.open('Location successfully added to favorites!', '', {
      duration: 3000,
      panelClass: ['centered-snackbar'],
      verticalPosition: 'top',
    });
  }

  onInvalidLocation() {
    this.snackBar.open('Invalid location. Please enter a valid location name.', '', {
      duration: 3000,
      panelClass: ['centered-snackbar'],
      verticalPosition: 'top',
    });
  }

  onLocationAdded(location: string): void {
    this.addToFavoriteLocations(location);
    this.onLocationAddedToFavorites();
  }

  onFavoriteLocationSelected(location: string) {
    this.router.navigate(['/']);
    this.locationSearchComponent.searchText = location;
    this.onLocationSelected(location);
  }

  getWeatherData(location: string) {
    const apiKey = '834b7434e3ba4facbad131255232403';
    const currentWeather$ = this.weatherService.getCurrentWeather(location, apiKey);
    const forecast$ = this.weatherService.getForecast(location, apiKey);

    return forkJoin({ currentWeather: currentWeather$, forecast: forecast$ });
  }

  loadFavoriteLocations(): void {
    const storedLocations = localStorage.getItem('favoriteLocations');
    if (storedLocations) {
      this.favoriteLocations = JSON.parse(storedLocations);
    }
  }

  saveLocationToHistory(location: string): void {
    let locationHistory = JSON.parse(localStorage.getItem('locationHistory') || '[]');
    const existingLocationIndex = locationHistory.findIndex((loc: any) => loc.name === location);

    // If the location is already in the history, remove it to prevent duplicates.
    if (existingLocationIndex > -1) {
      locationHistory.splice(existingLocationIndex, 1);
    }

    // If there are already 7 items in the history, remove the oldest one.
    if (locationHistory.length >= 7) {
      locationHistory.shift();
    }

      // Add the new location to the history.
      locationHistory.push({ _id: '', name: location, coordinates: { lat: 0, lon: 0 } });

      // Save the updated history to local storage.
      localStorage.setItem('locationHistory', JSON.stringify(locationHistory));
    }
  
    addToFavoriteLocations(location: string): void {
      if (this.favoriteLocations.length >= 7) {
        this.favoriteLocations.shift();
      }
      this.favoriteLocations.push(location);
      localStorage.setItem('favoriteLocations', JSON.stringify(this.favoriteLocations));
    }
  }
  