import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AlertComponent } from './_directives/directives';

import { AuthGuard } from './_guards/auth.guard';

import { AlertService, AuthenticationService, RegistrationService, EventService } from './_services/services';

import { LoginComponent, RegisterComponent, HomeComponent } from './_components/components';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    RegistrationService,
    EventService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
