import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { surveyItemDto } from '../dto/model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5081/AllProduct'; // Base API URL

  constructor(private httpClient: HttpClient) {}

  // Get all survey items
  get(): Observable<surveyItemDto[]> {
    return this.httpClient.get<surveyItemDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get survey by ID
  getById(prodId: string): Observable<surveyItemDto> {
    return this.httpClient.get<surveyItemDto>(`${this.apiUrl}/${prodId}`).pipe(
      catchError(this.handleError)
    );
  } 

  // Create a new survey item
  create(survey: surveyItemDto): Observable<surveyItemDto> {
    return this.httpClient.post<surveyItemDto>(this.apiUrl, survey).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing survey item by ID
  update(prodId: number, updatedProduct: surveyItemDto): Observable<surveyItemDto> {
    return this.httpClient.put<surveyItemDto>(`${this.apiUrl}/${prodId}`, updatedProduct).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a survey by ID
  delete(prodId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${prodId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteSurveys(ids: number[]): Observable<void> {
    const url = `${this.apiUrl}/delete-multiple`;
    return this.httpClient.post<void>(url, { ids }).pipe(
        catchError(this.handleError)
    );
  }

  // deleteSurveys(ids: number[]): Observable<void> {
  //     const url = `${this.apiUrl}/delete-multiple`;
  //     return this.httpClient.post<void>(url, {ids}).pipe(
  //       catchError(this.handleError)
  //     );
  // }
  

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error); // Log to console
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }

  

}
