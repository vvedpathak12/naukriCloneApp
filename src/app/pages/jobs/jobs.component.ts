import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnDestroy {
  activeJobListingArr: any[] = [];
  first = 0;
  rows = 5;
  subscription: Subscription[] = [];

  constructor(private jobSrv: JobService, private router: Router) { }

  ngOnInit(): void {
    this.loadActiveJobListing();
  }

  loadActiveJobListing() {
    const activeJobListing = this.jobSrv.getActiveJobListing().subscribe((res: any) => {
      if (res.result) {
        this.activeJobListingArr = res.data;
      }
    });
    this.subscription.push(activeJobListing);
  }

  visibleJobs() {
    // Calculate the subset of jobs to display based on the current page
    return this.activeJobListingArr.slice(this.first, this.first + this.rows);
  }

  hasValidExtension(url: string): boolean {
    // Define valid extensions (you can extend this list if needed)
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // Get the file extension from the URL
    const fileExtension = url.substring(url.lastIndexOf('.'));

    // Check if the extension is in the valid extensions list
    return validExtensions.includes(fileExtension.toLowerCase());
  }

  openJobDetails(jobId: number) {
    this.jobSrv.showLoader.next(true);
    setTimeout(() => {
      this.router.navigate(['/job-details', jobId]);
      this.jobSrv.showLoader.next(false);
    }, 500);
  }

  onPageChange(event: any) {
    this.first = event.first;
  }

  ngOnDestroy(): void {
    this.subscription.forEach((ele: any) => {
      ele.unsubscribe();
    });
  }

}
