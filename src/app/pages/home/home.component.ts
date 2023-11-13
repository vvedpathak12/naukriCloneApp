import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private job: JobService, private router: Router) {}

  ngOnInit(): void {
  }

  search(){
    this.job.showLoader.next(true);
    setTimeout(() => {
      this.router.navigate(['/jobs']);
      this.job.showLoader.next(false);
    }, 500);
  }

}
