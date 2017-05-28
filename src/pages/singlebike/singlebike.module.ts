import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinglebikePage } from './singlebike';

@NgModule({
  declarations: [
    SinglebikePage,
  ],
  imports: [
    IonicPageModule.forChild(SinglebikePage),
  ],
  exports: [
    SinglebikePage
  ]
})
export class SinglebikePageModule {}
