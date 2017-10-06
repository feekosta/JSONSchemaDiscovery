import {BrowserModule}             from '@angular/platform-browser';
import {BrowserAnimationsModule}   from '@angular/platform-browser/animations';
import {NgModule}                  from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule}                from '@angular/http';
import {CdkTableModule}            from '@angular/cdk/table';
import { MomentModule } from 'angular2-moment';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  NoConflictStyleCompatibilityMode
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
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NoConflictStyleCompatibilityMode
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
    MomentModule
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
