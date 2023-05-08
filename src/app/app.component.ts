import { Component, ViewChild, OnInit } from '@angular/core';
import { LocationSearchComponent } from './location-search/location-search.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WeatherMate';
  favoriteLocations: string[] = [];
  currentWeather: any;
  forecast: any;

  @ViewChild('locationSearchComponent') locationSearchComponent!: LocationSearchComponent;

  constructor(private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const location = params['location'];
      if (location) {
      }
    });
  }


  onLocationAdded(location: string) {
    let favoriteLocations = JSON.parse(localStorage.getItem('favoriteLocations') || '[]');
    if (!favoriteLocations.includes(location)) {
      favoriteLocations.push(location);
      localStorage.setItem('favoriteLocations', JSON.stringify(favoriteLocations));
      this.snackBar.open('Location successfully added to favorites!', '', {
        duration: 3000,
      });
    }
  }


  onLocationSelected(location: string) {
    this.locationSearchComponent.getWeatherData(location)
      .pipe(
        catchError((error) => {
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
          this.currentWeather = data.currentWeather;
          this.forecast = data.forecast;
        }
      });
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
    });
  }

  onLocationDeleted(location: string) {
    const index = this.favoriteLocations.indexOf(location);
    if (index !== -1) {
      this.favoriteLocations.splice(index, 1);
    }
  }

  onInvalidLocation() {
    this.snackBar.open('Invalid location. Please enter a valid location name.', '', {
      duration: 3000,
    });
  }
  onLocationDeletedFromFavorites(location: string) {
    const index = this.favoriteLocations.indexOf(location);
    if (index !== -1) {
      this.favoriteLocations.splice(index, 1);
    }
  }
  
}

