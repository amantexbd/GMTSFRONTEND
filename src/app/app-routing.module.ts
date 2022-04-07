import { EmployeesComponent } from './modules/employees/employees.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { SigninComponent } from './modules/signin/signin.component';
// import { SignupComponent } from './modules/signup/signup.component';
// import { UserProfileComponent } from './modules/user-profile/user-profile.component';
// import { AuthGuard } from "./shared/auth.guard";

// const routes: Routes = [
//   { path: '',pathMatch: 'full',component: HomeComponent,canActivate: [AuthGuard]},
//   //{ path: '', redirectTo: '/log-in', pathMatch: 'full' },
//   { path: 'log-in', component: SigninComponent },
//   { path: 'sign-up', component: SignupComponent },
//   { path: 'home', component: HomeComponent },
//   { path: '**', redirectTo: '' },
// ];
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCompanyComponent } from './modules/admin-company/admin-company.component';
import { AdminUsersComponent } from './modules/admin-users/admin-users.component';
import { HomeComponent } from './modules/home/home.component';
import { SigninComponent } from './modules/signin/signin.component';

const routes: Routes = [
  
  {
    path: '',
    component: SigninComponent,
    
  },
  {
    path: 'login',
    component: SigninComponent,
    
  },
  {
    path: 'default',
    component: DashboardComponent,
    
  },
//   {
//   path: 'default',
//   component: DashboardComponent,
//   children: [{
//     path: '',
//     component: DashboardComponent
//   }
// ]},
{path: 'admin-company', component: AdminCompanyComponent},
{path: 'admin-users', component: AdminUsersComponent},
{path: 'employees', component: EmployeesComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

