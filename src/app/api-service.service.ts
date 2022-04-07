import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  endpoint: string = `${environment.apiUrl}api/`;
  
  constructor(private http: HttpClient,
    public router: Router,
    private _snackBar: MatSnackBar) { }

  
  addCompany(data:any) {
    return this.http.post(`${this.endpoint}company`, data);
  }
  updateCompany(data:any) {
    return this.http.put(this.endpoint + `company`, data);
  }
  getCompanyList():Observable<any[]> {
    return this.http.get<any>(this.endpoint + 'company');
  }

  deleteCompany(id:number|string) {
    return this.http.delete(this.endpoint + `company/${id}`);
  }
}
