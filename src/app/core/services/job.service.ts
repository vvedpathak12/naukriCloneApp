import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  apiUrl: string = environment.apiEndPoint;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getInitialLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  public showLoader = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  private getInitialLoginStatus(): boolean {
    // Implement your logic to determine the initial login status here.
    // You can check if a user is logged in based on local storage or other criteria.
    // If a user is logged in, return `true`, otherwise return `false`.
    const userData = localStorage.getItem('jobLoginUser');
    return userData !== null;
  }

  // Use this method to update the login status
  setLoggedInStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  onRegister(obj: any): Observable<any> {
    return this.http.post(this.apiUrl + 'AddNewEmployer', obj)
  }

  onRegisterAsJobSeeker(obj: any): Observable<any> {
    return this.http.post(this.apiUrl + 'AddNewJobSeeker', obj)
  }

  onLogin(obj: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Login', obj)
  }

  getAllJobCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'GetAllJobCategory')
  }

  getActiveJobListing(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'GetActiveJobListing')
  }

  createNewJobListing(obj: any): Observable<any> {
    return this.http.post(this.apiUrl + 'CreateNewJobListing', obj)
  }

  getActiveJobListingByJobId(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'GetJobListingById?jobId=' + jobId)
  }

  sendJobApplication(obj: any): Observable<any> {
    return this.http.post(this.apiUrl + 'SendJobApplication', obj)
  }

  getJobsByEmployerId(employerId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'GetJobsByEmployerId?employerId=' + employerId)
  }
}
