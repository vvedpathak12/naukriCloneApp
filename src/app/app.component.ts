import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { JobService } from './core/services/job.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  userInfo: any = {};

  constructor(private job: JobService, private router: Router, private confirmationService: ConfirmationService, private toastr: ToastrService) {
    this.job.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        // The user is logged in, fetch user info
        const userData = localStorage.getItem('jobLoginUser');
        if (userData !== null) {
          const parseObj = JSON.parse(userData);
          this.userInfo = parseObj;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  onRegister() {
    this.job.showLoader.next(true);
    setTimeout(() => {
      this.router.navigate(['register']);
      this.job.showLoader.next(false);
    }, 500);
  }

  onLogin() {
    this.job.showLoader.next(true);
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.job.showLoader.next(false);
    }, 500);
  }

  onLogOut() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to log out?',
      accept: () => {
        localStorage.removeItem('jobLoginUser');
        this.job.setLoggedInStatus(false);
        this.toastr.success('Logged Out Successfully');
      }
    });
  }

}


