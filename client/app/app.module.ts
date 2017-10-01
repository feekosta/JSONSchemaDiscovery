import {BrowserModule}             from '@angular/platform-browser';
import {BrowserAnimationsModule}   from '@angular/platform-browser/animations';
import {NgModule}                  from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule}                from '@angular/http';
import {CdkTableModule}            from '@angular/cdk/table';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdStepperModule
} from '@angular/material';

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard }        from './_guards/auth.guard';
import { 
  AlertService, 
  AuthenticationService, 
  EventService,
  FeedbackService,
  RegistrationService,
  JsonSchemaService
} from './_services/services';
import { 
  FeedbackComponent,
  NavbarComponent,
  LoginComponent, 
  RegisterComponent, 
  HomeComponent,
  DiscoveryComponent,
  UserComponent,
  AlertComponent,
  SchemesComponent
} from './_components/components';

@NgModule({
  exports: [
    CdkTableModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdStepperModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule
  ]
})
export class AppMaterialModule {}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AlertComponent,
    DiscoveryComponent,
    FeedbackComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    SchemesComponent,
    UserComponent,
    AppComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    RegistrationService,
    EventService,
    FeedbackService,
    JsonSchemaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
