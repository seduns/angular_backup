import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VehicleProductDto } from '../dto/model';

@Injectable({
  providedIn: 'root',
})
export class vehicleProductService {
  private apiUrl = 'http://localhost:5081/Vehicle'; // Base API URL

  //test on this

  constructor(private httpClient: HttpClient) {}

  // Get all survey items
  get(): Observable<VehicleProductDto[]> {
    return this.httpClient.get<VehicleProductDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get survey by ID
  getById(id: string): Observable<VehicleProductDto> {
    return this.httpClient.get<VehicleProductDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  } 

  // Create a new survey item
  create(product: VehicleProductDto): Observable<VehicleProductDto> {
    return this.httpClient.post<VehicleProductDto>(this.apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing survey item by ID
  update(id: number, survey: VehicleProductDto): Observable<VehicleProductDto> {
    return this.httpClient.put<VehicleProductDto>(`${this.apiUrl}/${id}`, survey).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a survey by ID
  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error); // Log to console
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }
}
