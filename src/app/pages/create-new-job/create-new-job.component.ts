import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-create-new-job',
  templateUrl: './create-new-job.component.html',
  styleUrls: ['./create-new-job.component.css']
})
export class CreateNewJobComponent implements OnInit, OnDestroy {
  @ViewChild('jobForm') jobForm!: NgForm; // Used ViewChild to access the form
  jobObj: any = {
    "JobId": 0,
    "JobName": "",
    "CreatedDate": new Date(),
    "EmployerId": 0,
    "CategoryId": null,
    "Experience": "",
    "Package": "",
    "Location": "",
    "JobDescription": "",
    "IsActive": true
  };
  categoryArr: any[] = [];
  isApiCallInProgress: boolean = false;
  userInfo: any = {};
  subscription: Subscription[] = [];

  constructor(private jobSrv: JobService, private toastr: ToastrService, private router: Router) {
    const userData = localStorage.getItem('jobLoginUser');
    if (userData !== null) {
      const parseObj = JSON.parse(userData);
      this.userInfo = parseObj;
      this.jobObj.EmployerId = this.userInfo.employerId;
    }
  }

  ngOnInit(): void {
    this.loadAllJobCategory();
  }

  loadAllJobCategory() {
    const jobCategory = this.jobSrv.getAllJobCategory().subscribe((res: any) => {
      if (res.result) {
        this.categoryArr = res.data;
      }
    });
    this.subscription.push(jobCategory);
  }

  createNewJob() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      const newJob = this.jobSrv.createNewJobListing(this.jobObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.onReset();
          this.toastr.success(res.message);
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toastr.error(err.message);
      });
      this.subscription.push(newJob);
    }
  }

  onReset() {
    this.jobObj = {
      "JobId": 0,
      "JobName": "",
      "CreatedDate": new Date(),
      "EmployerId": 0,
      "CategoryId": null,
      "Experience": "",
      "Package": "",
      "Location": "",
      "JobDescription": "",
      "IsActive": true
    };
    this.jobForm.resetForm();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((ele: any) => {
      ele.unsubscribe();
    });
  }

}
