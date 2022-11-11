import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule } from 'ion2-calendar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouteReuseStrategy } from '@angular/router';
// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './translate-config.service';
import { HttpClient } from '@angular/common/http';
import { ComponentModule } from './component/component.module';
// import { ButtonComponent } from './component/button/button.component';
// import { ButtonComponent } from './component/button/button.component';
// import { ImageComponent } from './component/image/image.component';
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CalendarModule.forRoot({
      doneLabel: 'Save',
      closeIcon: true,
      clearLabel: 'Clear',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
    NgxDaterangepickerMd.forRoot(),
    NgxDatatableModule,
    ComponentModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    TranslateConfigService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
