import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ApplicationUser } from '../models/application-user';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginResult {
  username: string;
  role: string;
  originalUserName: string;
  accessToken: string;
  refreshToken: string;
}



@Injectable({
  providedIn: 'root',
})




export class AuthService {
  endpoint: string = `${environment.apiUrl}api/auth`;

  private timer: Subscription | null = null;
  private _user = new BehaviorSubject<ApplicationUser | null>(null);
  user$ = this._user.asObservable();
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(private http: HttpClient,
     public router: Router,
     private _snackBar: MatSnackBar) {}
  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
  // Sign-up
  signUp(LoginResult: ApplicationUser): Observable<any> {
    let api = `${this.endpoint}/Register`;
    return this.http.post(api, LoginResult).pipe(catchError(this.handleError));
  }
  //Sign-in
  // Sign-in
  signIn(user: LoginResult) {
    return this.http
      .post<any>(`${this.endpoint}/login`, user)
      .subscribe({
        next:(res)=>{
        this.sendAuthStateChangeNotification(true);
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('userid', res.userid);
        localStorage.setItem('adminuserid', res.adminuserid);
        localStorage.setItem('username', res.username);
        this.router.navigate(['default']);
        
        },
        error:()=>{
         this.sendAuthStateChangeNotification(false);
         this._snackBar.open("Login Failed", "Failed", {
          duration: 1000
        });
        }
      });

  }

  logout() {
          this.clearLocalStorage();
          this._user.next(null);
          this.stopTokenTimer();
          this.sendAuthStateChangeNotification(false);
          
    // this.http
    //   .post<unknown>('${this.apiUrl}/logout', {})
    //   .pipe(
    //     finalize(() => {
    //       this.clearLocalStorage();
    //       this._user.next(null);
    //       this.stopTokenTimer();
    //       this.sendAuthStateChangeNotification(false);
    //     })
    //   )
    //   .subscribe();
  }


  getToken() {
    return localStorage.getItem('access_token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
    }
  }
  // User profile
  getUserProfile(id: any): Observable<any> {
    let api = `${this.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  setLocalStorage(x: LoginResult) {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('refresh_token', x.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userid');
    localStorage.removeItem('adminuserid');
    localStorage.removeItem('username');
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  refreshToken(): Observable<LoginResult | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }

    return this.http
      .post<LoginResult>('${this.apiUrl}/refresh-token', { refreshToken })
      .pipe(
        map((x) => {
          this._user.next({
            username: x.username,
            role: x.role,
            originalUserName: x.originalUserName,
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }


  private getTokenRemainingTime() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  private startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap({
          next: () => this.refreshToken().subscribe(),
        })
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  
  addUser(data:any) {
    return this.http.post(`${this.endpoint}/register`, data);
  }
  updateUser(data:any) {
    // console.log(userId);
    console.log(data);
    return this.http.put(this.endpoint + `/useredit`, data);
  }
  getUserList():Observable<any[]> {
    return this.http.get<any>(this.endpoint + '/users');
  }
  
}

