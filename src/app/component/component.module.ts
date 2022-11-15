import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MyCommonModule } from '../tooltip/tooltip.module';
import { ButtonComponent } from './button/button.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DropBoxesComponent } from './drop-boxes/drop-boxes.component';
import { RadioButtonsComponent } from './radio-buttons/radio-buttons.component';
import { ImageComponent } from './image/image.component';
import { LabelComponent } from './label/label.component';
import { StandarButtonComponent } from './standar-button/standar-button.component';
import { DropDownComponent } from './drop-down/drop-down.component';

@NgModule({
  declarations: [
    ImageComponent,
    LabelComponent,
    ButtonComponent,
    DropBoxesComponent,
    RadioButtonsComponent,
    StandarButtonComponent,
    DropDownComponent,
  ],
  exports: [
    ImageComponent,
    LabelComponent,
    ButtonComponent,
    DropBoxesComponent,
    RadioButtonsComponent,
    StandarButtonComponent,
    DropDownComponent,
  ],

  imports: [
    MyCommonModule,
    CommonModule,
    TranslateModule,
    IonicModule,
    FormsModule,
  ],
})
export class ComponentModule {}
