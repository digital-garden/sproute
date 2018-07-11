import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPlantPage } from './add-plant';

@NgModule({
  declarations: [
    AddPlantPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPlantPage),
  ],
})
export class AddPlantPageModule {}
