import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

 // Fetches the current weather data for the provided location
  getCurrentWeather(location: string, apiKey: string): Observable<any> {
    return this.http.get<any>(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
  }
  // Fetches the weather forecast data for the provided location
  getForecast(location: string, apiKey: string): Observable<any> {
    return this.http.get<any>(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5`);
  }
}
