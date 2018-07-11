import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControlName, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { MongoService } from "../../services/mongo.service";

// AngularFireList, AngularFireObject 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

name: any;
soil: any;
water: any;
sun: any;
species: any;
notes: any;



  constructor(public navCtrl: NavController, public db: MongoService, private fb: FormBuilder,private auth: AuthService) {
    
    this.name = this.navParams.get('plant.name')
    this.soil = this.navParams.get('plant.soilType')
    this.sun = this.navParams.get('plant.sunType')
    this.water = this.navParams.get('plant.waterType')
    this.species = this.navParams.get('plant.species')
    this.notes = this.navParams.get('plant.notes')
    
    this.plantsRef = this.db.list('/plants');
    this.plants = this.plantsRef.snapshotChanges().map(changes => {
      console.log(changes);
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.editPlantForm = this.fb.group(
      {
        name: ['', Validators.required],
        speciesname: ['', Validators.required],
        note: ['', Validators.required]
      }
    )

  }


  toggleEditPlantForm(plantKey) {
    this.isEditVisible = !this.isEditVisible;
    this.plantKey = plantKey;
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
    // .catch(err => console.log(err, 'Sem permissao!'));
  }

  updatePlant(plantKey: string, name: string, speciesname: string, note: string) {
    this.plantsRef.set(plantKey,
      {
        name: name,
        speciesname: speciesname,
        note: note
      })
      .then(_ => {console.log('Single Item Set Successfully'); 
      this.isEditVisible = !this.isEditVisible})
      .catch(err => console.log(err, 'You do not have access to Set!'));
  }

  removePlant(plantKey: string) {
    this.plantsRef.remove(plantKey)
      .then(_ => console.log('Single Item Removed Successfully'))
      .catch(err => console.log(err, 'You do not have access to Remove!'));
  }

  removeAll() {
    this.plantsRef.remove()
      .then(_ => console.log('All Items Removed Successfully'))
      .catch(err => console.log(err, 'You do not have access to Remove!'));
  }

  logout() {
    this.auth.signOut();
    this.navCtrl.setRoot(HomePage);
  }
}
