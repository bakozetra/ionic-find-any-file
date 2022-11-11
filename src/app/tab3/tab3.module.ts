import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';

// import { HomePageRoutingModule } from './home-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
// import { ComponentModule } from '../component/component.module';
import { MyCommonModule } from '../tooltip/tooltip.module';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
    MatTooltipModule,
    TranslateModule,
    NgbModule,
    MyCommonModule,
    ComponentModule,
  ],
  declarations: [Tab3Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab3PageModule {}

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     MatTooltipModule,
//     NgbModule,
//     TranslateModule,
//     MyCommonModule,
//     ComponentModule,
//   ],
//   declarations: [HomePage],
// })
// export class HomePageModule {}
