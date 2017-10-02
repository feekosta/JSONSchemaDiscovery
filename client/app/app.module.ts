import {BrowserModule}             from '@angular/platform-browser';
import {BrowserAnimationsModule}   from '@angular/platform-browser/animations';
import {NgModule}                  from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule}                from '@angular/http';
import {CdkTableModule}            from '@angular/cdk/table';
import { FyAngularJsonViewerModule } from '@gofynd/angular-json-viewer';
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
  SchemesComponent,
  BatchComponent,
  BatchDeleteModalComponent,
  JsonSchemaComponent
} from './_components/components';
import PrettyJsonPipe from './_pipes/pretty-json.pipe';

@NgModule({
  exports: [
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
    ReactiveFormsModule,
    FyAngularJsonViewerModule
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
    BatchComponent,
    BatchDeleteModalComponent,
    JsonSchemaComponent,
    PrettyJsonPipe,
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
  entryComponents: [
    BatchDeleteModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
