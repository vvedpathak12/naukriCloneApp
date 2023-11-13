import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private jobSrv: JobService) {
    this.jobSrv.showLoader.subscribe((res: any) => {
      if (res === true) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    })
  }

  ngOnInit(): void {
  }

}
