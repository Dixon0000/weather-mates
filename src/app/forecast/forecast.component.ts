import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnChanges {
  @Input() forecastData: any;
  forecast: any;

  // Listens for changes to the forecastData input and updates the forecast variable accordingly
  ngOnChanges(changes: SimpleChanges) {
    if (changes['forecastData'] && changes['forecastData'].currentValue) {
      this.forecast = changes['forecastData'].currentValue;
      console.log('Number of days in the forecast:', this.forecast.forecast.forecastday.length);
    }
  }  
}
