import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }



  // Api call Functions 



  getRecordings(endpoint:any){
    return this.http.get(environment.Url + endpoint)
  }

  postRecording(endpoint:any,params:any){
    return this.http.post(environment.pankaj + endpoint,params)
  }

  public allow = new BehaviorSubject<any>('');
  allow$ = this.allow.asObservable()
}
