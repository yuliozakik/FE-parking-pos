import { Routes } from '@angular/router';
import { CheckInComponent } from './check-in/check-in.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'check-in', component: CheckInComponent },
  { path: 'check-out', component: CheckOutComponent }
];
