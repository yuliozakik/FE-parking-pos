import { Component, OnInit, Inject } from '@angular/core';
import { ParkingService } from '../services/parking.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, RouterModule],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  plateNumber: string = '';
  vehicleType: string = '';

  loading = false;
  isTicketChecked = false;

  now: Date = new Date();

  dataDetail: any = {
    jenisParkir: '-',
    checkInTime: null,
    checkOutTime: null,
    name: '-',
    fee: 0
  };

  private timer: any;
  paymentMethod = 'CASH';
  parkingSlip: string = '';
  voucherCode: string = '';

  constructor(
    private parkingService: ParkingService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.timer = setInterval(() => {
        this.now = new Date();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  checkTicket() {
  if (!this.plateNumber || !this.vehicleType) return;

  this.loading = true;
  this.isTicketChecked = false;

  this.parkingService.checkTicket(this.plateNumber, this.vehicleType)
    .subscribe({
      next: (res: any) => {
        this.dataDetail = {
          ticketId: res.ticketId,
          plateNumber: res.plateNumber,
          checkInTime: res.checkInTime,
          checkOutTime: res.checkOutPreviewTime,
          fee: res.totalPrice,
          totalHours: res.totalHours,
          isMember: res.isMember,
          name: '-',
          expiredDate: null
        };

        if (!res.isMember) {
          this.isTicketChecked = true;
          this.loading = false;
          return;
        }

        this.parkingService.checkMember(this.plateNumber, this.vehicleType)
          .subscribe({
            next: (m: any) => {
              this.dataDetail.name = m.name;
              this.dataDetail.expiredDate = m.expiredDate;
              this.dataDetail.jenisParkir = m.jenisParkir || this.vehicleType;

              this.isTicketChecked = true;
              this.loading = false;
            },
            error: () => {
              alert("Gagal mengambil Info Member");
              this.isTicketChecked = true;
              this.loading = false;
            }
          });
      },
      error: (err) => {
        alert(err.error?.message || 'Ticket tidak ditemukan!');
        this.loading = false;
      }
    });
}

  submitCheckOut() {
    if (!this.isTicketChecked) return;

    this.loading = true;

    this.parkingService.finalCheckout(this.dataDetail.ticketId)
      .subscribe({
        next: () => {
          alert('Check-out berhasil dan struk telah dicetak!');
          this.resetPage();
          this.loading = false;
        },
        error: (err) => {
          alert('Gagal menyelesaikan checkout!');
          console.error(err);
          this.loading = false;
        }
      });
  }

  resetPage() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }
}
