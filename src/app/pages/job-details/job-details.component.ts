import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  activeJobId: number = 0;
  jobListObj: any;
  isLoggedIn: boolean = false;
  userInfo: any = {};
  jobApplyObj: any = {
    "applicationId": 0,
    "jobId": 0,
    "jobSeekerId": 0,
    "appliedDate": new Date(),
    "applcationStatus": "New"
  }
  isApiCallInProgress: boolean = false;
  subscription: Subscription[] = [];

  constructor(private activatedRoute: ActivatedRoute, private jobSrv: JobService, private toastr: ToastrService, private router: Router) {
    const userData = localStorage.getItem('jobLoginUser');
    if (userData !== null) {
      const parseObj = JSON.parse(userData);
      this.userInfo = parseObj;
      this.jobApplyObj.jobSeekerId = this.userInfo.jobSeekerId;
    }

    this.activatedRoute.params.subscribe((res: any) => {
      this.activeJobId = res.jobId;
      this.getActiveJobListingByJobId();
      this.jobApplyObj.jobId = this.activeJobId;
    });

    this.jobSrv.isLoggedIn$.subscribe((res: any) => {
      this.isLoggedIn = res;
    });
  }

  ngOnInit(): void {

  }

  getActiveJobListingByJobId() {
    const getActiveJobListingByJobId = this.jobSrv.getActiveJobListingByJobId(this.activeJobId).subscribe((res: any) => {
      if (res.result) {
        this.jobListObj = res.data;
      }
    });
    this.subscription.push(getActiveJobListingByJobId);
  }

  hasValidExtension(url: string): boolean {
    // Define valid extensions (you can extend this list if needed)
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // Get the file extension from the URL
    const fileExtension = url.substring(url.lastIndexOf('.'));

    // Check if the extension is in the valid extensions list
    return validExtensions.includes(fileExtension.toLowerCase());
  }

  applyToJob() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      const applyToJob = this.jobSrv.sendJobApplication(this.jobApplyObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success(res.message);
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toastr.error(err.message);
      });
      this.subscription.push(applyToJob);
    }
  }

  loginToApply() {
    this.jobSrv.showLoader.next(true);
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.jobSrv.showLoader.next(false);
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((ele: any) => {
      ele.unsubscribe();
    });
  }

}
