import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  checkIn(plateNumber: string, type: string, isMember: boolean, idMember: number | null): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkin`, {
      plateNumber,
      type,
      isMember,
      idMember
    });
  }

  checkTicket(plateNumber: string, type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/checkout/check`, {
      params: { plateNumber, type }
    });
  }

  finalCheckout(ticketId:number): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout`, {
      ticketId
    });
  }
  checkMember(plateNumber: string, type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/checkmember`, {
      params: {
        plateNumber,
        type
      }
    });
  }
}
