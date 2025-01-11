import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { FileItemDTO } from '../model';

@Injectable({
  providedIn: 'root',
})
export class FileItem {
    private apiUrl = 'http://localhost:5081/FileItem'; // Base API URL

    constructor(private httpClient: HttpClient) {}
  
    // Get all file items
    get(): Observable<FileItemDTO[]> {
      return this.httpClient.get<FileItemDTO[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
  
    // Get file by ID
    getById(id: string): Observable<FileItemDTO> {
      return this.httpClient.get<FileItemDTO>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    // Create a new file item (file upload)
    create(fileItem: FileItemDTO): Observable<FileItemDTO> {
      const formData = new FormData();
      formData.append('file', fileItem.file, fileItem.fileName);
  
      return this.httpClient.post<FileItemDTO>(this.apiUrl, formData).pipe(
        catchError(this.handleError)
      );
    }
  
    // Update an existing file item by ID
    update(id: string, fileItem: FileItemDTO): Observable<FileItemDTO> {
      const formData = new FormData();
      formData.append('file', fileItem.file, fileItem.fileName);
  
      return this.httpClient.put<FileItemDTO>(`${this.apiUrl}/${id}`, formData).pipe(
        catchError(this.handleError)
      );
    }
  
    // Delete a file item by ID
    delete(id: string): Observable<void> {
      return this.httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    // Error handling method
    private handleError(error: HttpErrorResponse): Observable<never> {
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
      console.error('Error response:', error.error);
      return throwError(() => new Error('Something went wrong, please try again later.'));
    }
  
}
