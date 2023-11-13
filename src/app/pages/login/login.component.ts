import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginObj: any = {
    "userName": "",
    "password": ""
  };
  isApiCallInProgress: boolean = false;
  loginWrongCredentials: string = '';
  subscription: Subscription[] = [];

  constructor(private router: Router, private job: JobService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        const login = this.job.onLogin(this.loginObj).subscribe((res: any) => {
          if (res.result && res.message != 'Wrong Credentials') {
            this.isApiCallInProgress = false;
            localStorage.setItem('jobLoginUser', JSON.stringify(res.data));
            this.job.setLoggedInStatus(true);
            this.toastr.success('Logged In Successful');
            this.router.navigateByUrl('home');
          } else {
            this.isApiCallInProgress = false;
            res.message = 'Invalid details. Please check the Email ID - Password combination.'
            this.loginWrongCredentials = res.message;
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
          err.message = 'Invalid details. Please check the Email ID - Password combination.'
          this.loginWrongCredentials = err.message;
        });
        this.subscription.push(login);
      }
    } else {
      Object.values(loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  register() {
    this.job.showLoader.next(true);
    setTimeout(() => {
      this.router.navigate(['/register']);
      this.job.showLoader.next(false);
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((ele: any) => {
      ele.unsubscribe();
    });
  }
}
