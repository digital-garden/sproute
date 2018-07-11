import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControlName, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// AngularFireList, AngularFireObject 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-add-plant',
  templateUrl: 'add-plant.html'
})

export class AddPlantPage {

  plantsRef: AngularFireList<any>;
  plants: Observable<any[]>;
  editPlantForm: FormGroup;
  isEditVisible = false;
  plantKey;


  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private fb: FormBuilder,private auth: AuthService) {

    this.plantsRef = this.db.list('/plants');
    this.plants = this.plantsRef.snapshotChanges().map(changes => {
      console.log(changes);
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }


  pushPlantToList(name: string, speciesname: string, note: string) {
    this.plantsRef.push(
      {
        name: name,
        speciesname: speciesname,
        note: note
      }
    )
      .then(_ => console.log('Nova Plant Adicionada!'))
  }
  
  logout() {
    this.auth.signOut();
    this.navCtrl.setRoot(HomePage);
  }
}
