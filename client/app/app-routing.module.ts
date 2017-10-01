import { NgModule } 			from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } 			from './_guards/auth.guard';
import {
	AlertComponent,
	DiscoveryComponent,
	HomeComponent,
	LoginComponent, 
	RegisterComponent, 
	UserComponent,
} from './_components/components';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'alert', component: AlertComponent, canActivate: [AuthGuard] },
	{ path: 'discovery', component: DiscoveryComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
	{ path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }