import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private url = 'http://localhost:5000/locations';

  constructor(private http: HttpClient) {}

  // Fetches all locations from the server
  getLocations(): Observable<any> {
    return this.http.get(this.url);
  }

  // Adds a new location to the server
  addLocation(name: string, coordinates: { lat: number; lon: number }): Observable<any> {
    const location = { name, coordinates };
    return this.http.post(this.url, location);
  }

  // Deletes a location by its ID
  deleteLocation(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Checks if a location with the given name already exists
  exists(name: string): Observable<any> {
    return this.http.get(`${this.url}/exists/${name}`);
  }

  // Fetches the user's favorite locations
  getFavoriteLocations(): Observable<any> {
    return this.http.get(this.url);
  }
}
