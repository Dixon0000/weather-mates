import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeatherService } from '../weather.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
})
export class LocationSearchComponent implements OnInit {
  @Input() favoriteLocations: Array<{ _id: string, name: string, coordinates: { lat: number, lon: number } }> = [];
  @Output() locationSelected = new EventEmitter<string>();
  @Output() addToFavorites = new EventEmitter<any>();
  @Output() currentWeatherReceived = new EventEmitter<any>();
  @Output() forecastReceived = new EventEmitter<any>();

  apiKey = '834b7434e3ba4facbad131255232403';
  searchText: string = '';

  constructor(private weatherService: WeatherService, private locationService: LocationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onLocationSubmit(location: string) {
    this.getWeatherData(location)
      .pipe(
        catchError((error: Error) => {
          console.error('Error fetching weather data:', error);
          this.snackBar.open('Invalid location, please try again.', '', {
            duration: 3000,
            panelClass: ['centered-snackbar'],
            verticalPosition: 'top',
          });
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.locationSelected.emit(location);
          this.currentWeatherReceived.emit(data.currentWeather);
          this.forecastReceived.emit(data.forecast);
        }
      });
  }
  onAddToFavorites(location: string) {
    this.weatherService.getCurrentWeather(location, this.apiKey).subscribe(
      (data) => {
        const coordinates = {
          lat: data.location.lat,
          lon: data.location.lon,
        };
        this.locationService.exists(data.location.name).subscribe(
          (result: { exists: boolean }) => {
            if (result.exists) {
              this.snackBar.open('This location is already in your favorites.', '', {
                duration: 3000,
                panelClass: ['centered-snackbar'],
                verticalPosition: 'top',
              });
            } else {
              this.locationService
                .addLocation(data.location.name, coordinates)
                .subscribe(
                  (response: any) => {
                    console.log('Location added successfully:', response);
                  },
                  (error: any) => {
                    console.error('Error adding location:', error);
                  }
                );
            }
          },
          (error: any) => {
            console.error('Error checking location existence:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }
  
  
  

  getWeatherData(location: string) {
    const currentWeather$ = this.weatherService.getCurrentWeather(location, this.apiKey);
    const forecast$ = this.weatherService.getForecast(location, this.apiKey);

    return forkJoin({ currentWeather: currentWeather$, forecast: forecast$ });
  }

  private isLocationAlreadyFavorited(location: string): boolean {
    return this.favoriteLocations.some(
      (favoriteLocation) => favoriteLocation.name.toLowerCase() === location.toLowerCase()
    );
  }
}
