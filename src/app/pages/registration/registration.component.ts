import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('companyRegisterForm') companyRegisterForm!: NgForm;
  @ViewChild('jobSeekerRegisterForm') jobSeekerRegisterForm!: NgForm;
  registerObj: any = {
    "employerId": 0,
    "companyName": "",
    "emailId": "",
    "mobileNo": "",
    "phoneNo": "",
    "companyAddress": "",
    "city": "",
    "state": "",
    "pinCode": "",
    "logoURL": "",
    "gstNo": ""
  };
  jobSeekerRegisterObj: any = {
    "jobSeekerId": 0,
    "fullName": "",
    "emailId": "",
    "mobileNo": "",
    "experienceStatus": "",
    "resumeUrl": "",
    "JobSeekerSkills": [],
    "JobSeekerWorkExperiences": []
  };
  isApiCallInProgress: boolean = false;
  isJobSeeker: boolean = true;
  subscription: Subscription[] = [];

  constructor(private router: Router, private job: JobService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onRegisterAsCompany() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.job.showLoader.next(true);
      const registerAsCompany = this.job.onRegister(this.registerObj).subscribe((res: any) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.isApiCallInProgress = false;
          this.onReset();
          this.job.showLoader.next(false);
          this.router.navigateByUrl('/login');
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message);
          this.job.showLoader.next(false);
        }
      });
      this.subscription.push(registerAsCompany);
    }
  }

  onRegisterAsJobSeeker() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.job.showLoader.next(true);
      const registerAsJobSeeker = this.job.onRegisterAsJobSeeker(this.jobSeekerRegisterObj).subscribe((res: any) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.isApiCallInProgress = false;
          this.onResetJobSeeker();
          this.job.showLoader.next(false);
          this.router.navigateByUrl('/login');
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message);
          this.job.showLoader.next(false);
        }
      });
      this.subscription.push(registerAsJobSeeker);
    }
  }

  onReset() {
    this.registerObj = {
      "employerId": 0,
      "companyName": "",
      "emailId": "",
      "mobileNo": "",
      "phoneNo": "",
      "companyAddress": "",
      "city": "",
      "state": "",
      "pinCode": "",
      "logoURL": "",
      "gstNo": ""
    };
    this.companyRegisterForm.resetForm();
  }

  onResetJobSeeker() {
    this.jobSeekerRegisterObj = {
      "jobSeekerId": 0,
      "fullName": "",
      "emailId": "",
      "mobileNo": "",
      "experienceStatus": "",
      "resumeUrl": "",
      "JobSeekerSkills": [],
      "JobSeekerWorkExperiences": []
    };
    this.jobSeekerRegisterForm.resetForm();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((ele: any) => {
      ele.unsubscribe();
    });
  }

}
