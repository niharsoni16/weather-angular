import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http:HttpClient) { }

  url='https://weatherdbi.herokuapp.com/data/weather'

  apiGet(cityName: string){
    return this.http.get(`${this.url}/${cityName}`)
  }


}
