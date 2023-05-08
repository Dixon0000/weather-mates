import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { FavoriteLocationsComponent } from './favorite-locations/favorite-locations.component';
import { ForecastComponent } from './forecast/forecast.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { WeatherService } from './weather.service';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FavoriteLocationsPageComponent } from './favorite-locations-page/favorite-locations-page.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationSearchComponent,
    CurrentWeatherComponent,
    ForecastComponent,
    FavoriteLocationsComponent,
    ConfirmationDialogComponent,
    FavoriteLocationsPageComponent,
    HomeComponent,  
    AboutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [
    DatePipe,
    WeatherService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
