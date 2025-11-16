import { Component, OnInit, Inject } from '@angular/core';
import { ParkingService } from '../services/parking.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, RouterModule],
  templateUrl: './check-in.component.html'
})
export class CheckInComponent {

  plateNumber = '';
  vehicleType = '';
  loading = false;
  now = new Date();
  dataDetail: any = {
    jenisParkir: '-',
    expiredDate: null,
    name: '-'
  };
  isMemberChecked = false;
  isMember = false;
  private timer: any;

  constructor(private parking: ParkingService,
        @Inject(PLATFORM_ID) private platformId: any
  ) {}
  ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.timer = setInterval(() => {
          this.now = new Date();
        }, 1000);
      }
    }
  submit() {
    if (!this.isMemberChecked) {
      alert("Please check plate number first.");
      return;
    }

    this.loading = true;

    this.parking.checkIn(this.plateNumber, this.vehicleType, this.dataDetail.jenisParkir == 'MEMBER' ? true : false , this.dataDetail.idMember).subscribe({
      next: () => {
        alert("Check-in success!");
        this.resetPage();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert("Gagal menyelesaikan checkin!");
        this.loading = false;
      }
    });
  }


  checkMember() {
  if (!this.plateNumber) {
    alert("Plate number required.");
    return;
  }
  if (!this.vehicleType) {
    alert("Vehicle type required.");
    return;
  }

  this.loading = true;

  this.parking.checkMember(this.plateNumber, this.vehicleType).subscribe({
    next: (res) => {
      this.dataDetail = res;
      if(this.dataDetail.jenisParkir == 'MEMBER'){
        this.isMember = true;
      }
      this.isMemberChecked = true;

      this.loading = false;
      alert("Plate checked!");
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      alert(err.error?.message || "Backend error!");
    }
  });
}

resetPage() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }

}
