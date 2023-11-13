import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.css']
})
export class JobListingComponent implements OnInit, OnDestroy {
  userInfo: any = {};
  jobArr: any[] = [];
  subscription: Subscription[] = [];

  constructor(private jobSrv: JobService) {
    const userData = localStorage.getItem('jobLoginUser');
    if (userData !== null) {
      const parseObj = JSON.parse(userData);
      this.userInfo = parseObj;
      this.getJobsByEmployerId();
    }
  }

  ngOnInit(): void {
  }

  getJobsByEmployerId() {
    const getJobsByEmployerId = this.jobSrv.getJobsByEmployerId(this.userInfo.employerId).subscribe((res: any) => {
      if (res.result) {
        this.jobArr = res.data;
      }
    });
    this.subscription.push(getJobsByEmployerId);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((ele: any) => {
      ele.unsubscribe();
    });
  }

}
