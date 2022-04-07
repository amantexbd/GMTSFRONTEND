import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApplicationUser } from 'src/app/models/application-user';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  
  showHead: boolean = false;
  showFooter: boolean = false;
  public user!: ApplicationUser; 

  constructor(public authService: AuthService,private router: Router) { 
    this.authService.authChanged
    .subscribe(res => {
      this.showHead = res;
    })
  }

  ngOnInit(): void {
    this.showHead = this.authService.isLoggedIn;
    console.log(this.showHead);
  }

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"]);
  }


  addnewUser(){
    this.authService.signUp(this.user)
  }

}
