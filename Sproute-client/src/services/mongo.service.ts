import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController, NavController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class MongoService {
 
 //store retrieved items from mongodb
 	public items: array <any>;
    
 //
    private _HOST: string = "http://10.0.0.142:8080/catalogue";
    
  constructor(public http: HttpClient) {
 
  }
 

  
  getPlants(options){
		  return new Promise((resolve, reject) => {
      this.http.post('http://10.0.0.142:8080/catalo/plants', JSON.stringify(options), {
					headers: new HttpHeaders().set('Content-Type', 'application/json'),
				})
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
			});
			}

 
  
 
}